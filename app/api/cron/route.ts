import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  // 1. Find pending jobs
  const { data: jobsData, error: jobFetchError } = await supabase
    .from('job_queue')
    .select('*')
    .eq('status', 'pending')
    .lte('run_at', now)
    .limit(10);

  if (jobFetchError) {
    return NextResponse.json({ error: "Failed to fetch jobs", details: jobFetchError }, { status: 500 });
  }
  
  const jobs = jobsData as any[];
  if (!jobs || jobs.length === 0) return NextResponse.json({ message: 'No jobs due' });

  const processed = [];
  const errors = [];

  // 2. Loop through jobs
  for (const job of jobs) {
    if (job.type === 'send_survey') {
      const { client_id, phone, name } = job.payload;

      // Try to insert into mock_outbox
      const { error: outboxError } = await supabase.from('mock_outbox').insert({
        to_phone: phone,
        body: `Hi ${name || 'there'} 👋 Thanks for visiting Mama Oliech! How was your experience? Reply with one emoji: 😡 😕 😐 😊 🤩`
      });

      if (outboxError) {
        console.error("Outbox insert failed:", outboxError);
        errors.push({ jobId: job.id, error: outboxError.message });
        continue; // Skip to next job if this fails
      }

      // Try to insert into messages log
      await supabase.from('messages').insert({
        client_id,
        direction: 'outbound',
        body: `[MOCK SURVEY SENT]`,
        status: 'sent'
      });

      // Mark job as done
      await supabase.from('job_queue').update({ status: 'done' }).eq('id', job.id);
      processed.push(job.id);
    }
  }

  return NextResponse.json({ success: true, processed, errors });
      }
