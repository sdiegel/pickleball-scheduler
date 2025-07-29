'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function DebugDB() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('matches').select('*', { count: 'exact', head: true });
      if (!error) setCount(data ? (data as any).length ?? 0 : 0);
    })();
  }, []);

  if (count === null) return <p>Loading DB…</p>;
  return <p>Matches in DB: {count}</p>;
}

