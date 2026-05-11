'use server';

import { supabase } from '@/lib/supabase';

const WAITLIST_COUNT_OFFSET = 300;

export async function getWaitlistCount(): Promise<number> {
  const { count, error } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true });

  if (error || count === null) {
    return WAITLIST_COUNT_OFFSET;
  }

  return count + WAITLIST_COUNT_OFFSET;
}
