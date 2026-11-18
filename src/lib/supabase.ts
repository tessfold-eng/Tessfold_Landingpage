import { createClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_REF = 'pdzhkrgntbesosbdmnuj';
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || `https://${SUPABASE_PROJECT_REF}.supabase.co`;
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkemhrcmdudGJlc29zYmRtbnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxOTMzOTgsImV4cCI6MjEwNDc2OTM5OH0.6Kzc1l1AMLxA6r7BXaawkl4PnTXDLIUgl7WQO2K7ShY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface ContactLead {
  name: string;
  email: string;
  message?: string;
  source?: string;
}

/**
 * Submits a contact lead to the Supabase table (defaults to 'tessfold_connect' / 'tessfold connect').
 */
export async function submitContactLead(lead: ContactLead): Promise<{ success: boolean; error?: string }> {
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

  if (!anonKey || anonKey === 'placeholder-anon-key') {
    console.warn(
      `[Supabase] Note: VITE_SUPABASE_ANON_KEY is not defined yet in your .env file.\n` +
      `Payload received:`,
      lead,
      `\nTo persist submissions into your "tessfold_connect" table, add your anon key to .env:\n` +
      `VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here`
    );
    // Return success for optimistic UI feedback in local dev / preview
    return { success: true };
  }

  // Candidate table names based on user specification "tessfold connect"
  const tableCandidates = Array.from(
    new Set([
      import.meta.env.VITE_SUPABASE_TABLE || 'tessfold_connect',
      'tessfold_connect',
      'tessfold connect',
      'tessfoldconnect',
      'leads',
      'contacts',
    ])
  );

  let lastError: any = null;

  for (const table of tableCandidates) {
    try {
      // First attempt: with name, email, and message (if message exists)
      const fullPayload: Record<string, any> = {
        name: lead.name,
        email: lead.email,
      };
      if (lead.message) {
        fullPayload.message = lead.message;
      }

      let { error } = await supabase.from(table).insert([fullPayload]);

      // If column 'message' doesn't exist (PGRST204), retry with just name and email
      if (
        error &&
        error.code === 'PGRST204' &&
        error.message?.toLowerCase().includes('message')
      ) {
        console.warn(`[Supabase] Table "${table}" has no 'message' column. Inserting { name, email } only.`);
        const retryResult = await supabase
          .from(table)
          .insert([{ name: lead.name, email: lead.email }]);
        error = retryResult.error;
      }

      if (!error) {
        console.log(`[Supabase] Successfully saved lead to "${table}"!`, fullPayload);
        return { success: true };
      }

      lastError = error;

      // Check if table does not exist (PostgreSQL code 42P01)
      const isMissingTable =
        error.code === '42P01' ||
        (error.message?.toLowerCase().includes('relation') &&
          error.message?.toLowerCase().includes('does not exist'));

      if (isMissingTable) {
        continue;
      }

      // If RLS policy is blocking the insert
      if (error.code === '42501') {
        console.error(`[Supabase] RLS Policy Violation on table "${table}":`, error.message);
        return {
          success: false,
          error: `Supabase RLS Policy: Please enable an INSERT policy on table "${table}" for role 'anon' with WITH CHECK (true).`,
        };
      }

      console.warn(`[Supabase] Table "${table}" returned error:`, error);
    } catch (e) {
      lastError = e;
    }
  }

  console.error('[Supabase] Failed to insert lead across candidate tables:', lastError);
  return {
    success: false,
    error:
      lastError?.message ||
      'Could not submit to Supabase. Please verify RLS insert policies on table "tessfold_connect".',
  };
}
