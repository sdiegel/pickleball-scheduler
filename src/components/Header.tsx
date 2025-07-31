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
      <header className="flex items-center justify-between bg-gray-50 p-4 shadow-sm">
        <h1 className="text-lg font-bold">Pickleball Scheduler</h1>

        {session ? (
          <div className="flex items-center gap-3">
            <Button onClick={() => setShowPostModal(true)}>New Post</Button>
            <span className="text-sm">{session.user.email}</span>
            <Button variant="ghost" onClick={() => supabase.auth.signOut()}>
              Log out
            </Button>
            <ThemeToggle />
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
