export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function BoardPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect('/');

  const { data: matches } = await supabase
    .from('matches')
    .select('id, start_dt, notes')
    .order('start_dt', { ascending: true });

  return (
    <section className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Bulletin Board</h1>

      {matches?.length ? (
        <ul className="space-y-3">
          {matches.map((m) => (
            <li key={m.id} className="rounded border p-4 shadow">
              <p>{new Date(m.start_dt).toLocaleString()}</p>
              <p className="text-sm text-gray-600">{m.notes}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No matches posted yet.</p>
      )}
    </section>
  );
}