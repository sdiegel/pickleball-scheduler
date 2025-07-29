'use client';

import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

import AuthModal from '@/components/AuthModal';
import NewPostModal from '@/components/NewPostModal';

export default function Header() {
  const session = useSession();
  const supabase = createPagesBrowserClient();
  const [showPostModal, setShowPostModal] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between bg-gray-50 p-4 shadow-sm">
        <h1 className="text-lg font-bold">Pickleball Scheduler</h1>

        {session ? (
          <div className="flex items-center gap-3">
            <button
              className="rounded bg-emerald-600 px-3 py-1 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition"
              onClick={() => setShowPostModal(true)}
            >
              New Post
            </button>

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

      {/* Modal lives outside header so z‑index is safe */}
      <NewPostModal open={showPostModal} onClose={() => setShowPostModal(false)} />
    </>
  );
}
