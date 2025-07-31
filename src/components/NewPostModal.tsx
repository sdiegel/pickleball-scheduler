'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

export default function Header() {
  const supabase = createPagesBrowserClient();
  const [showPostModal, setShowPostModal] = useState(false);

  return (
    <header className="flex items-center justify-between p-4">
      <h1 className="text-xl font-bold">Pickleball Scheduler</h1>
      <div className="flex items-center gap-2">
        <Button onClick={() => setShowPostModal(true)}>New Post</Button>
        <Button variant="ghost" onClick={() => supabase.auth.signOut()}>
          Log out
        </Button>
      </div>
    </header>
  );
}