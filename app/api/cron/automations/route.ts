import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createAdminClient();
  
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const results = {
    birthdaysFound: 0,
    winbacksFound: 0,
    errors: [] as string[]
  };

  // ── 1. BIRTHDAY AUTOMATION ──
  // Removed the strict is_active check just to be safe
  const { data: allClients, error: clientFetchError } = await supabase
    .from('clients')
    .select('id, phone_number, name, date_of_birth, last_visit_at');

  if (clientFetchError) {
    return NextResponse.json({ error: clientFetchError.message }, { status: 500 });
  }

  const clients = allClients as any[] || [];
  
  const birthdayJobs = [];
  const winbackJobs = [];

  for (const client of clients) {
    // Check Birthday
    if (client.date_of_birth) {
      const dob = new Date(client.date_of_birth);
      if ((dob.getMonth() + 1) === todayMonth && dob.getDate() === todayDay) {
        birthdayJobs.push({
          type: 'send_promo',
          run_at: new Date().toISOString(),
          payload: {
            client_id: client.id,
            phone: client.phone_number,
            message: `Happy Birthday ${client.name || 'there'}! 🎉 Come celebrate with us today and enjoy a FREE dessert on us. Just show this message to your waiter!`
          }
        });
        results.birthdaysFound++;
      }
    }

    // Check Winback (Hasn't visited in 30 days)
    if (client.last_visit_at) {
      const lastVisit = new Date(client.last_visit_at);
      if (lastVisit < new Date(thirtyDaysAgo)) {
        winbackJobs.push({
          type: 'send_promo',
          run_at: new Date().toISOString(),
          payload: {
            client_id: client.id,
            phone: client.phone_number,
            message: `Hi ${client.name || 'there'}, we miss you! 😢 It's been a while since your last visit. Come back this week and get 15% off your meal. Use code: MISSYOU15`
          }
        });
        results.winbacksFound++;
      }
    }
  }

  const allJobs = [...birthdayJobs, ...winbackJobs];

  if (allJobs.length > 0) {
    const { error: insertError } = await supabase.from('job_queue').insert(allJobs);
    if (insertError) results.errors.push("Job insert failed: " + insertError.message);
  }

  return NextResponse.json({ 
    success: true, 
    message: "Automations checked successfully",
    results
  });
    }
