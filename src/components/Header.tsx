'use client';

import { useSession } from '@supabase/auth-helpers-react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import AuthModal from '@/components/AuthModal';

export default function Header() {
  const session = useSession();
  const supabase = createPagesBrowserClient();

  return (
    <header className="flex items-center justify-between bg-white p-4 shadow">
      <h1 className="text-lg font-bold">Pickleball Scheduler</h1>

      {session ? (
        <div className="flex items-center gap-3">
          <span className="text-sm">{session.user.email}</span>
          <button
            className="rounded bg-gray-200 px-2 py-1 text-xs"
            onClick={() => supabase.auth.signOut()}
          >
            Log out
          </button>
        </div>
      ) : (
        <AuthModal />
      )}
    </header>
  );
}
