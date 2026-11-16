import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

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

  for (const job of jobs) {
    if (job.type === 'send_survey') {
      const { client_id, phone, name } = job.payload;
      
      // Get branch_id for the survey record
      const { data: clientData } = await supabase.from('clients').select('branch_id').eq('id', client_id).single();
      const branch_id = (clientData as any)?.branch_id;

      // 1. Create the PENDING survey
      const { data: surveyData, error: surveyError } = await supabase.from('surveys').insert({
        client_id: client_id,
        branch_id: branch_id,
        status: 'pending',
        sent_at: new Date().toISOString()
      }).select().single();

      if (surveyError) {
        console.error("Survey insert failed:", surveyError);
        errors.push({ jobId: job.id, error: surveyError.message });
        continue;
      }

      // 2. Insert into mock_outbox
      const { error: outboxError } = await supabase.from('mock_outbox').insert({
        to_phone: phone,
        body: `Hi ${name || 'there'} 👋 Thanks for visiting Mama Oliech! How was your experience? Reply with one emoji: 😡 😕 😐 😊 🤩`
      });

      if (outboxError) {
        console.error("Outbox insert failed:", outboxError);
        errors.push({ jobId: job.id, error: outboxError.message });
        continue; 
      }

      // 3. Log the outbound message
      await supabase.from('messages').insert({
        client_id,
        survey_id: (surveyData as any).id,
        direction: 'outbound',
        body: `[MOCK SURVEY SENT]`,
        status: 'sent'
      });

      // 4. Mark job as done
      await supabase.from('job_queue').update({ status: 'done' }).eq('id', job.id);
      processed.push(job.id);
    }
  }

  return NextResponse.json({ success: true, processed, errors });
    }
