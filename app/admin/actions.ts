'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function registerRestaurant(formData: FormData) {
  const supabase = createAdminClient();

  const name = formData.get('name') as string;
  const branchName = formData.get('branchName') as string;

  if (!name || !branchName) throw new Error('Name and Branch name are required');

  // 1. Create Restaurant
  const { data: restaurant, error: restError } = await supabase
    .from('restaurants')
    .insert({ name })
    .select()
    .single();

  if (restError) throw new Error(restError.message);

  // 2. Create Branch
  const { error: branchError } = await supabase
    .from('branches')
    .insert({
      restaurant_id: restaurant.id,
      name: branchName,
    });

  if (branchError) throw new Error(branchError.message);

  revalidatePath('/admin');
      }
