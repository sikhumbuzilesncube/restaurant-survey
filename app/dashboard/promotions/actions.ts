'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCampaign(formData: FormData) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: staffData } = await supabase.from('staff').select('branch_id').eq('id', user.id).single();
  const staff = staffData as any;
  if (!staff) return { error: 'Staff record not found' };

  const name = formData.get('name') as string;
  const audience = formData.get('audience') as string;
  const messageTemplate = formData.get('message') as string;

  if (!name || !audience || !messageTemplate) return { error: 'All fields are required' };

  // 1. Fetch the target audience based on the dropdown selection
  let query = supabase.from('clients').select('id, phone_number, name, last_visit_at, date_of_birth').eq('branch_id', staff.branch_id).eq('is_active', true);

  if (audience === 'inactive') {
    // Inactive for 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    query = query.or(`last_visit_at.lt.${thirtyDaysAgo},last_visit_at.is.null`);
  } else if (audience === 'birthday') {
    // This is a simplified birthday check for today. (We will improve this later)
    const todayMonth = new Date().getMonth() + 1;
    const todayDay = new Date().getDate();
    // Supabase doesn't easily query dates by month/day without an RPC, so we fetch all and filter in JS for now
  } else if (audience === 'happy') {
    // We would need to join with surveys, but for simplicity, let's just grab all for now
  }

  const { data: clientsData, error: clientsError } = await query;
  const clients = clientsData as any[] || [];

  if (clientsError) return { error: 'Failed to fetch audience' };
  if (clients.length === 0) return { error: 'No clients match this audience' };

  // 2. Create the Campaign record
  const { data: campaignData, error: campaignError } = await supabase
    .from('promotions')
    .insert({
      branch_id: staff.branch_id,
      name: name,
      audience_type: audience,
      message_template: messageTemplate,
      status: 'sending'
    })
    .select()
    .single();

  const campaign = campaignData as any;
  if (campaignError || !campaign) return { error: 'Failed to create campaign' };

  // 3. Queue the jobs for the worker
  const jobsToInsert = [];
  
  for (const client of clients) {
    // Skip birthday clients if it's not their birthday today
    if (audience === 'birthday' && client.date_of_birth) {
      const dob = new Date(client.date_of_birth);
      const today = new Date();
      if (dob.getMonth() !== today.getMonth() || dob.getDate() !== today.getDate()) {
        continue; 
      }
    }

    // Personalize the message
    let finalMessage = messageTemplate.replace(/{{name}}/g, client.name || 'there');

    jobsToInsert.push({
      type: 'send_promo',
      run_at: new Date().toISOString(), // Send immediately for promos
      payload: {
        campaign_id: campaign.id,
        client_id: client.id,
        phone: client.phone_number,
        message: finalMessage
      }
    });
  }

  if (jobsToInsert.length > 0) {
    await supabase.from('job_queue').insert(jobsToInsert);
  }

  // 4. Update campaign with total sent count
  await supabase.from('promotions').update({ total_sent: jobsToInsert.length }).eq('id', campaign.id);

  revalidatePath('/dashboard/promotions');
  return { success: true, count: jobsToInsert.length };
    }
