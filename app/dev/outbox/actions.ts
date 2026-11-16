'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const EMOJI_MAP: Record<string, number> = {
  '😡': 1, '😕': 2, '😐': 3, '😊': 4, '🤩': 5
};

export async function simulateReply(phone: string, emoji: string) {
  const supabase = createAdminClient();
  const rating = EMOJI_MAP[emoji] || 0;

  if (!rating) return { error: 'Invalid emoji' };

  // 1. Find the client
  const { data: clientData } = await supabase
    .from('clients')
    .select('id, branch_id')
    .eq('phone_number', phone)
    .single();
    
  const client = clientData as any;
  if (!client) return { error: 'Client not found' };

  // 2. Find the latest pending survey for this client
  const { data: surveyData } = await supabase
    .from('surveys')
    .select('id')
    .eq('client_id', client.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle(); // Use maybeSingle so it doesn't crash if none exist

  const survey = surveyData as any;

  // 3. Update the survey or create a new one
  let surveyId = survey?.id;

  if (surveyId) {
    await supabase
      .from('surveys')
      .update({
        status: 'responded',
        rating: rating,
        emoji: emoji,
        responded_at: new Date().toISOString()
      })
      .eq('id', surveyId);
  } else {
    const { data: newSurvey } = await supabase.from('surveys').insert({
      client_id: client.id,
      branch_id: client.branch_id,
      status: 'responded',
      rating: rating,
      emoji: emoji,
      responded_at: new Date().toISOString()
    }).select().single();
    surveyId = (newSurvey as any)?.id;
  }

  // 4. Log the inbound message
  await supabase.from('messages').insert({
    client_id: client.id,
    survey_id: surveyId,
    direction: 'inbound',
    body: emoji,
    status: 'received'
  });

  revalidatePath('/dev/outbox');
  revalidatePath('/dashboard');
  return { success: true };
}
