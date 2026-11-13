import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createAdminClient(); // Use admin to bypass RLS for background jobs
  const now = new Date().toISOString();

  // 1. Find jobs that are due (run_at is in the past) and still pending
  const { data: jobs, error } = await supabase
    .from('job_queue')
    .select('*')
    .eq('status', 'pending')
    .lte('run_at', now)
    .limit(10);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!jobs || jobs.length === 0) return NextResponse.json({ message: 'No jobs due' });

  const processed = [];

  // 2. Loop through the jobs
  for (const job of jobs) {
    if (job.type === 'send_survey') {
      const { client_id, phone, name } = job.payload;

      // MOCK WHATSAPP: Just save it to the mock_outbox table!
      await supabase.from('mock_outbox').insert({
        to_phone: phone,
        body: `Hi ${name || 'there'} 👋 Thanks for visiting Mama Oliech! How was your experience? Reply with one emoji: 😡 😕 😐 😊 🤩`
      });

      // Also save to the main messages log
      await supabase.from('messages').insert({
        client_id,
        direction: 'outbound',
        body: `[MOCK SURVEY SENT]`,
        status: 'sent'
      });

      // Mark the job as done
      await supabase.from('job_queue').update({ status: 'done' }).eq('id', job.id);
      processed.push(job.id);
    }
  }

  return NextResponse.json({ success: true, processed });
}
