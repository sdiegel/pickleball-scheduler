'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

export interface NewPostModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * NewPostModal
 * ------------
 * Renders a modal for creating a new match.
 * • When `open` is false, returns `null`.
 * • Calls `onClose()` when the Cancel/Close button is pressed.
 * (Form inputs omitted here for brevity—add them back once types compile.)
 */
export default function NewPostModal({ open, onClose }: NewPostModalProps) {
  const supabase = createPagesBrowserClient();

  // Early‑exit when the modal is not open
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur">
      <div className="card w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Create a Match</h2>

        {/* TODO: match form fields go here */}

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => {/* TODO: save logic */}}>
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}