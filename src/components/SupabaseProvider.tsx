'use client';

import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useRef } from 'react';

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const supabase = useRef(createPagesBrowserClient());

  return (
    <SessionContextProvider supabaseClient={supabase.current}>
      {children}
    </SessionContextProvider>
  );
}