'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function resolveAlert(surveyId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('surveys')
    .update({ is_resolved: true })
    .eq('id', surveyId);

  if (error) {
    console.error("Failed to resolve alert:", error);
    return;
  }

  revalidatePath('/dashboard');
}
