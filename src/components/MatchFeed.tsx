'use client';

import { useEffect, useState } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import MatchCard from '@/components/MatchCard';

type MatchRow = {
  id: string;
  start_dt: string;
  notes: string | null;
  capacity: number;
  format: string;
  locations?: { name: string | null } | null;
};

export default function MatchFeed({ initial }: { initial: MatchRow[] }) {
  const [matches, setMatches] = useState<MatchRow[]>(initial);
  const supabase = createPagesBrowserClient();

  // Debug: log matches whenever state updates
  useEffect(() => {
    console.log('MATCHES ARRAY', matches);
  }, [matches]);

  // Realtime listener for new matches
  useEffect(() => {
    const channel = supabase
      .channel('public:matches')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'matches' },
        (payload) =>
          setMatches((prev) =>
            [...prev, payload.new as MatchRow].sort(
              (a, b) =>
                new Date(a.start_dt).getTime() - new Date(b.start_dt).getTime()
            )
          )
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [supabase]);

  return (
    <section className="section">
      <h1 className="h1">Bulletin Board</h1>

      {matches.length ? (
        <ul className="space-y-3">
          {matches.map((m) => (
            <MatchCard
              key={m.id}
              id={m.id}
              start_dt={m.start_dt}
              notes={m.notes}
              capacity={m.capacity}
              format={m.format}
              locationName={m.locations?.name ?? 'Unknown court'}
            />
          ))}
        </ul>
      ) : (
        <p>No matches posted yet.</p>
      )}
    </section>
  );
}