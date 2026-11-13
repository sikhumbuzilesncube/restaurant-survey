import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { data: jobsData, error } = await supabase
    .from('job_queue')
    .select('*')
    .eq('status', 'pending')
    .lte('run_at', now)
    .limit(10);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  const jobs = jobsData as any[];
  if (!jobs || jobs.length === 0) return NextResponse.json({ message: 'No jobs due' });

  const processed = [];

  for (const job of jobs) {
    if (job.type === 'send_survey') {
      const { client_id, phone, name } = job.payload;

      await supabase.from('mock_outbox').insert({
        to_phone: phone,
        body: `Hi ${name || 'there'} 👋 Thanks for visiting Mama Oliech! How was your experience? Reply with one emoji: 😡 😕 😐 😊 🤩`
      });

      await supabase.from('messages').insert({
        client_id,
        direction: 'outbound',
        body: `[MOCK SURVEY SENT]`,
        status: 'sent'
      });

      await supabase.from('job_queue').update({ status: 'done' }).eq('id', job.id);
      processed.push(job.id);
    }
  }

  return NextResponse.json({ success: true, processed });
        }
