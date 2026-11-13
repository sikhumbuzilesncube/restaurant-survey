'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export async function registerClient(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: staffData } = await supabase.from('staff').select('branch_id').eq('id', user.id).single();
  const staff = staffData as any;
  if (!staff) return { error: 'Staff record not found' };

  const phone = formData.get('phone') as string;
  const name = formData.get('name') as string;
  const dob = formData.get('dob') as string;
  const consent = formData.get('consent') === 'on';

  if (!phone || !consent) return { error: 'Phone number and consent are required' };

  const secret = process.env.PHONE_HASH_SECRET || 'fallback-secret';
  const phoneHash = crypto.createHmac('sha256', secret).update(phone).digest('hex');

  const { data: clientData, error: clientError } = await supabase
    .from('clients')
    .upsert(
      {
        branch_id: staff.branch_id,
        phone_number: phone,
        phone_hash: phoneHash,
        name: name || null,
        date_of_birth: dob || null,
        consent_given_at: new Date().toISOString(),
        last_visit_at: new Date().toISOString(),
        is_active: true,
      },
      { onConflict: 'branch_id, phone_hash' }
    )
    .select()
    .single();

  const client = clientData as any;
  if (clientError || !client) return { error: 'Failed to save client' };

  await supabase.from('visits').insert({
    client_id: client.id,
    branch_id: staff.branch_id,
    cashier_id: user.id,
    visited_at: new Date().toISOString()
  });

  const runAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  await supabase.from('job_queue').insert({
    type: 'send_survey',
    run_at: runAt,
    payload: {
      client_id: client.id,
      phone: client.phone_number,
      name: client.name
    }
  });

  revalidatePath('/cashier');
  return { success: true };
          }
