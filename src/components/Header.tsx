'use client';

import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

import AuthModal from '@/components/AuthModal';
import Button from '@/components/ui/Button';
import NewPostModal from '@/components/NewPostModal';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Header() {
  const session = useSession();
  const supabase = createPagesBrowserClient();
  const [showPostModal, setShowPostModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/80 dark:border-gray-800">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold">Pickleball Scheduler</h1>

          {session ? (
            <div className="flex items-center gap-3">
              <Button onClick={() => setShowPostModal(true)}>New Post</Button>
              <span className="text-sm truncate max-w-[12rem]" title={session.user.email}>
                {session.user.email}
              </span>
              <Button variant="ghost" onClick={() => supabase.auth.signOut()}>
                Log out
              </Button>
              <ThemeToggle />
            </div>
          ) : (
            <AuthModal />
          )}
        </div>
      </header>

      {/* Modal lives outside header so z‑index is safe */}
      <NewPostModal open={showPostModal} onClose={() => setShowPostModal(false)} />
    </>
  );
}
