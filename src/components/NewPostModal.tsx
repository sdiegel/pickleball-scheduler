'use client';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useSession } from '@supabase/auth-helpers-react';

export default function NewPostModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const supabase = createPagesBrowserClient();
  const session = useSession();

  // form state
  const [location, setLocation] = useState('');
  // Default start = 30 min in the future (formatted for <input type="datetime-local">)
  const defaultStart = new Date(Date.now() + 30 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
  const [start, setStart] = useState(defaultStart);
  const [duration, setDuration] = useState(60);
  const [spots, setSpots] = useState(1);
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    if (!session) {
      alert('Please sign in first.');
      return;
    }
    console.log('SESSION', session);
    console.log('HOST ID', session.user.id);

    if (!location.trim()) {
      alert('Location is required');
      return;
    }
    if (!start) {
      alert('Start date/time is required');
      return;
    }

    // -------------------------------------------------------------------
    // Ensure a location row exists and get its id
    // -------------------------------------------------------------------
    const locationName = location.trim();

    // Try to find an existing location with the same name
    let { data: locRow, error: locSelectErr } = await supabase
      .from('locations')
      .select('id')
      .eq('name', locationName)
      .maybeSingle();

    if (locSelectErr) {
      alert(locSelectErr.message);
      return;
    }

    let locationId = locRow?.id;

    if (!locationId) {
      // Insert a new location row
      const { data: newLoc, error: locInsertErr } = await supabase
        .from('locations')
        .insert({ name: locationName, is_private: true })
        .select('id')
        .single();

      if (locInsertErr) {
        alert(locInsertErr.message);
        return;
      }

      locationId = newLoc.id;
    }

    // Ensure the logged‑in user exists in the public.users table (required for FK host_id)
    const { error: userUpsertErr } = await supabase
      .from('users')
      .upsert(
        [
          {
            id: session.user.id,
            display_name: session.user.email?.split('@')[0] ?? 'Player',
          },
        ],
        { onConflict: 'id' }
      );

    if (userUpsertErr) {
      console.error('USER UPSERT ERROR', userUpsertErr);
      alert(`User upsert failed: ${userUpsertErr.message}`);
      return;
    }

    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('id', session.user.id);

    console.log('USER ROW COUNT', userCount);

    const { error } = await supabase.from('matches').insert([
      {
        host_id: session?.user.id,           // satisfy RLS
        location_id: locationId,
        start_dt: new Date(start).toISOString(),
        duration_min: duration,
        capacity: spots,
        format: spots === 1 ? 'singles' : 'doubles',
        notes,
      },
    ]);

    if (error) { alert(error.message); return; }
    onClose();          // close modal on success
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow">
          <Dialog.Title className="mb-4 text-lg font-semibold">
            New Match
          </Dialog.Title>

          <input
            className="mb-3 w-full rounded border p-2"
            placeholder="Court name / location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            className="mb-3 w-full rounded border p-2"
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />

          <select
            className="mb-3 w-full rounded border p-2"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
          >
            {[30, 60, 90, 120].map((m) => (
              <option key={m} value={m}>{m} min</option>
            ))}
          </select>

          <select
            className="mb-3 w-full rounded border p-2"
            value={spots}
            onChange={(e) => setSpots(parseInt(e.target.value))}
          >
            {[1, 2, 3].map((s) => (
              <option key={s} value={s}>{s} open spot{s > 1 ? 's' : ''}</option>
            ))}
          </select>

          <textarea
            className="mb-3 w-full rounded border p-2"
            rows={3}
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <button className="rounded bg-gray-200 px-3 py-1" onClick={onClose}>
              Cancel
            </button>
            <button className="rounded bg-emerald-600 px-3 py-1 text-white" onClick={handleSave}>
              Post
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}