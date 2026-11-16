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

  // 1. Find the client by phone
  const { data: clientData } = await supabase
    .from('clients')
    .select('id, branch_id')
    .eq('phone_number', phone)
    .single();
    
  const client = clientData as any;
  if (!client) return { error: 'Client not found' };

  // 2. Find their latest unanswered survey
  const { data: surveyData } = await supabase
    .from('surveys')
    .select('id')
    .eq('client_id', client.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const survey = surveyData as any;

  // 3. Update the survey with the rating
  if (survey) {
    await supabase
      .from('surveys')
      .update({
        status: 'responded',
        rating: rating,
        emoji: emoji,
        responded_at: new Date().toISOString()
      })
      .eq('id', survey.id);
  } else {
    // If no survey was found, create one as responded (for testing)
    await supabase.from('surveys').insert({
      client_id: client.id,
      branch_id: client.branch_id,
      status: 'responded',
      rating: rating,
      emoji: emoji,
      responded_at: new Date().toISOString()
    });
  }

  // 4. Log the inbound message
  await supabase.from('messages').insert({
    client_id: client.id,
    direction: 'inbound',
    body: emoji,
    status: 'received'
  });

  // 5. Refresh the page so the outbox shows it was replied to
  revalidatePath('/dev/outbox');
  return { success: true };
    }
