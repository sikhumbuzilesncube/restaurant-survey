'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

// Explicitly telling TypeScript this function returns a Promise with an object
export async function registerClient(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const supabase = createClient();

  // 1. Verify user is logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // 2. Get the staff member's branch
  const { data: staff } = await supabase.from('staff').select('branch_id').eq('id', user.id).single();
  if (!staff) return { error: 'Staff record not found' };

  // 3. Extract form data
  const phone = formData.get('phone') as string;
  const name = formData.get('name') as string;
  const dob = formData.get('dob') as string;
  const consent = formData.get('consent') === 'on';

  if (!phone || !consent) return { error: 'Phone number and consent are required' };

  // 4. Hash the phone number for unique lookup
  const secret = process.env.PHONE_HASH_SECRET || 'fallback-secret';
  const phoneHash = crypto.createHmac('sha256', secret).update(phone).digest('hex');

  // 5. Insert or update the client
  const { data: client, error: clientError } = await supabase
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
      { onConflict: 'branch_id, phone_hash' } // Update if they've visited before
    )
    .select()
    .single();

  if (clientError) {
    console.error(clientError);
    return { error: 'Failed to save client' };
  }

  // 6. Create the visit record
  await supabase.from('visits').insert({
    client_id: client.id,
    branch_id: staff.branch_id,
    cashier_id: user.id,
    visited_at: new Date().toISOString()
  });

  // 7. Refresh the page so the new client shows up in the list
  revalidatePath('/cashier');
  return { success: true };
  }
