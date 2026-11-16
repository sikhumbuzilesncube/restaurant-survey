import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createAdminClient();
  
  // Get today's date details for birthdays
  const today = new Date();
  const todayMonth = today.getMonth() + 1; // 1-12
  const todayDay = today.getDate();        // 1-31

  // 30 days ago for win-backs
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const results = {
    birthdaysSent: 0,
    winbacksSent: 0,
    errors: [] as string[]
  };

  // ── 1. BIRTHDAY AUTOMATION ──
  // Note: In a massive database, you'd use a Postgres function, but we can fetch all active clients and filter in JS for now.
  const { data: allClients } = await supabase
    .from('clients')
    .select('id, phone_number, name, date_of_birth, branch_id')
    .eq('is_active', true)
    .not('date_of_birth', 'is', null);

  const birthdayClients = (allClients as any[] || []).filter(client => {
    const dob = new Date(client.date_of_birth);
    return (dob.getMonth() + 1) === todayMonth && dob.getDate() === todayDay;
  });

  if (birthdayClients.length > 0) {
    const birthdayJobs = birthdayClients.map(client => ({
      type: 'send_promo',
      run_at: new Date().toISOString(),
      payload: {
        client_id: client.id,
        phone: client.phone_number,
        message: `Happy Birthday ${client.name || 'there'}! 🎉 Come celebrate with us today and enjoy a FREE dessert on us. Just show this message to your waiter!`
      }
    }));

    const { error } = await supabase.from('job_queue').insert(birthdayJobs);
    if (error) results.errors.push("Birthday job failed: " + error.message);
    else results.birthdaysSent = birthdayJobs.length;
  }

  // ── 2. WIN-BACK AUTOMATION ──
  // Find clients whose last_visit was more than 30 days ago
  const { data: lostClients } = await supabase
    .from('clients')
    .select('id, phone_number, name, last_visit_at')
    .eq('is_active', true)
    .lt('last_visit_at', thirtyDaysAgo);

  const winbackClients = lostClients as any[] || [];

  if (winbackClients.length > 0) {
    const winbackJobs = winbackClients.map(client => ({
      type: 'send_promo',
      run_at: new Date().toISOString(),
      payload: {
        client_id: client.id,
        phone: client.phone_number,
        message: `Hi ${client.name || 'there'}, we miss you! 😢 It's been a while since your last visit. Come back this week and get 15% off your meal. Use code: MISSYOU15`
      }
    }));

    const { error } = await supabase.from('job_queue').insert(winbackJobs);
    if (error) results.errors.push("Winback job failed: " + error.message);
    else results.winbacksSent = winbackJobs.length;
  }

  return NextResponse.json({ 
    success: true, 
    message: "Automations checked successfully",
    results
  });
}
