'use server';

import { resolveMx } from 'dns/promises';
import { supabase } from '@/lib/supabase';
import { validateEmail } from '@/lib/emailValidation';

export type WaitlistSource = 'hero' | 'cta' | 'social-proof';

export type WaitlistResult =
  | { success: true }
  | { success: false; error: 'duplicate' | 'invalid' | 'no_mx' | 'server' };

const MX_TIMEOUT_MS = 4_000;

async function domainHasMxRecord(domain: string): Promise<boolean> {
  try {
    const records = await Promise.race([
      resolveMx(domain),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('mx_timeout')), MX_TIMEOUT_MS)
      ),
    ]);
    return Array.isArray(records) && records.length > 0;
  } catch (err) {
    // Fail open on timeout so a slow DNS server never blocks a real user.
    // Fail closed on ENOTFOUND / ENODATA, domain genuinely doesn't exist.
    if (err instanceof Error) {
      if (err.message === 'mx_timeout') return true;
      const code = (err as NodeJS.ErrnoException).code;
      if (code === 'ENOTFOUND' || code === 'ENODATA') return false;
    }
    return true;
  }
}

export interface WaitlistDetails {
  /** Free text, may list more than one bank, e.g. "Sparkasse, N26". */
  bank?: string;
  country?: string;
}

export async function submitWaitlist(
  email: string,
  source: WaitlistSource = 'hero',
  details: WaitlistDetails = {}
): Promise<WaitlistResult> {
  // Layer 1, format + disposable domain + suspicious pattern
  const validation = validateEmail(email);
  if (!validation.valid) {
    return { success: false, error: 'invalid' };
  }

  const { normalised } = validation;
  const domain = normalised.split('@')[1];

  // Layer 2, MX record existence (domain must have a real mail server)
  const hasMx = await domainHasMxRecord(domain);
  if (!hasMx) {
    return { success: false, error: 'no_mx' };
  }

  // Layer 3, persist (unique constraint catches duplicate emails)
  const row: {
    email: string;
    source: WaitlistSource;
    bank?: string;
    country?: string;
  } = { email: normalised, source };

  const bank = details.bank?.trim().slice(0, 200);
  const country = details.country?.trim().slice(0, 100);
  if (bank) row.bank = bank;
  if (country) row.country = country;

  const { error } = await supabase.from('waitlist').insert(row);

  if (error) {
    console.error('[waitlist] Supabase error:', error.code, error.message);
    if (error.code === '23505') {
      return { success: false, error: 'duplicate' };
    }
    return { success: false, error: 'server' };
  }

  return { success: true };
}
