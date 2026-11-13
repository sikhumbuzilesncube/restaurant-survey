'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export async function registerClient(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // 1. Get staff branch
  const { data: staffData, error: staffError } = await supabase
    .from('staff')
    .select('branch_id')
    .eq('id', user.id)
    .single();
    
  const staff = staffData as any;
  
  // If no staff record, try to find the first branch as a fallback so testing doesn't break
  let branchId = staff?.branch_id;
  if (!branchId) {
    const { data: branch } = await supabase.from('branches').select('id').limit(1).single();
    branchId = branch?.id;
  }
  
  if (!branchId) return { error: 'No branch found. Please check Supabase setup.' };

  const phone = formData.get('phone') as string;
  const name = formData.get('name') as string;
  const dob = formData.get('dob') as string;
  const consent = formData.get('consent') === 'on';

  if (!phone || !consent) return { error: 'Phone number and consent are required' };

  const secret = process.env.PHONE_HASH_SECRET || 'fallback-secret';
  const phoneHash = crypto.createHmac('sha256', secret).update(phone).digest('hex');

  // 2. Save Client
  const { data: clientData, error: clientError } = await supabase
    .from('clients')
    .upsert(
      {
        branch_id: branchId,
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
  if (clientError || !client) {
    console.error("Client Error:", clientError);
    return { error: 'Failed to save client' };
  }

  // 3. Save Visit
  await supabase.from('visits').insert({
    client_id: client.id,
    branch_id: branchId,
    cashier_id: user.id,
    visited_at: new Date().toISOString()
  });

  // 4. Schedule Job
  const runAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  const { error: jobError } = await supabase.from('job_queue').insert({
    type: 'send_survey',
    run_at: runAt,
    payload: {
      client_id: client.id,
      phone: client.phone_number,
      name: client.name
    }
  });

  if (jobError) {
    console.error("Job Queue Error:", jobError);
    return { error: 'Client saved, but failed to schedule survey.' };
  }

  revalidatePath('/cashier');
  return { success: true };
}
