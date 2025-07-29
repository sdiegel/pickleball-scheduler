'use client';
import { useEffect, useState } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

type MatchRow = {
  id: string;
  start_dt: string;
  notes: string | null;
  capacity: number;
  format: string;
};

export default function MatchFeed({ initial }: { initial: MatchRow[] }) {
  const [matches, setMatches] = useState<MatchRow[]>(initial);
  const supabase = createPagesBrowserClient();

  useEffect(() => {
    // Live INSERT listener
    const channel = supabase
      .channel('public:matches')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'matches' },
        payload => {
          setMatches(prev =>
            [...prev, payload.new as MatchRow].sort(
              (a, b) => new Date(a.start_dt).getTime() - new Date(b.start_dt).getTime()
            )
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  return (
    <section className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Bulletin Board</h1>

      {matches.length ? (
        <ul className="space-y-3">
          {matches.map(m => (
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