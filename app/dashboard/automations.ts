'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function runDailyAutomations() {
  const supabase = createAdminClient();
  
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: allClients, error: fetchError } = await supabase
    .from('clients')
    .select('id, phone_number, name, date_of_birth, last_visit_at');

  if (fetchError) throw new Error("Database fetch failed: " + fetchError.message);

  const clients = allClients as any[] || [];
  const jobsToInsert = [];

  for (const client of clients) {
    if (client.date_of_birth) {
      const dob = new Date(client.date_of_birth);
      // Use UTC to avoid timezone bugs
      if ((dob.getUTCMonth() + 1) === todayMonth && dob.getUTCDate() === todayDay) {
        jobsToInsert.push({
          type: 'send_promo',
          run_at: new Date().toISOString(),
          payload: {
            client_id: client.id,
            phone: client.phone_number,
            message: `Happy Birthday ${client.name || 'there'}! 🎉 Come celebrate with us today and enjoy a FREE dessert on us. Just show this message to your waiter!`
          }
        });
      }
    }

    if (client.last_visit_at) {
      const lastVisit = new Date(client.last_visit_at);
      if (lastVisit < new Date(thirtyDaysAgo)) {
        jobsToInsert.push({
          type: 'send_promo',
          run_at: new Date().toISOString(),
          payload: {
            client_id: client.id,
            phone: client.phone_number,
            message: `Hi ${client.name || 'there'}, we miss you! 😢 It's been a while since your last visit. Come back this week and get 15% off your meal. Use code: MISSYOU15`
          }
        });
      }
    }
  }

  if (jobsToInsert.length > 0) {
    const { error: insertError } = await supabase.from('job_queue').insert(jobsToInsert);
    if (insertError) throw new Error("Insert failed: " + insertError.message);
  } else {
    throw new Error("No clients matched the birthday or win-back criteria today.");
  }

  revalidatePath('/dashboard');
  }
