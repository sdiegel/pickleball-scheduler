'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function HomePage() {
  const [matchCount, setMatchCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      const { count, error } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Supabase error:', error);
        return;
      }
      setMatchCount(count ?? 0);
    };

    fetchCount();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="mb-4 text-2xl font-bold">Pickleball Scheduler</h1>

      {matchCount === null ? (
        <p>Loading database…</p>
      ) : (
        <p>Matches in DB: {matchCount}</p>
      )}
    </main>
  );
}