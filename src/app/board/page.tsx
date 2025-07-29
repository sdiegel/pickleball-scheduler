// src/app/board/page.tsx
// Run dynamically so we can read the auth cookie
export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import MatchFeed from '@/components/MatchFeed'; // ← new client component

export default async function BoardPage() {
  // Call cookies() once and pass a stable store to Supabase
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // Require login
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/');

  // Initial list of matches (server‑side)
  const { data: matches } = await supabase
    .from('matches')
    .select('id, start_dt, notes, capacity, format')
    .order('start_dt');

  return <MatchFeed initial={matches ?? []} />;
}