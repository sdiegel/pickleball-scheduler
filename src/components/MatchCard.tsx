'use client';

import Button from '@/components/ui/Button';

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */
export interface MatchCardProps {
  id: string;
  start_dt: string;          // ISO-ish date string from Supabase
  notes: string | null;
  capacity: number;
  format: string;            // 'singles' | 'doubles'
  locationName: string;
}

/* ------------------------------------------------------------------ */
/* Helper: safe date parser                                            */
/* ------------------------------------------------------------------ */
function parseSupabaseDate(raw: string): Date | null {
  // Supabase may return without 'T' or timezone. Try plain, then with 'Z'
  const try1 = new Date(raw);
  if (!Number.isNaN(try1.getTime())) return try1;

  const try2 = new Date(raw.replace(' ', 'T') + 'Z');
  return Number.isNaN(try2.getTime()) ? null : try2;
}

/* ------------------------------------------------------------------ */
/* MatchCard component                                                 */
/* ------------------------------------------------------------------ */
export default function MatchCard({
  id,
  start_dt,
  notes,
  capacity,
  format,
  locationName,
}: MatchCardProps) {
  const dt = parseSupabaseDate(start_dt);
  const badgeMonth = dt
    ? dt.toLocaleString('default', { month: 'short' })
    : '?';
  const badgeDay = dt ? dt.getDate().toString() : '--';

  const timeStr = dt
    ? dt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : '—';

  return (
    <li key={id} className="card flex items-center gap-4">
      {/* Date badge */}
      <div className="flex flex-col items-center justify-center rounded-md bg-brand text-white w-14 h-14 shrink-0">
        <span className="text-xs uppercase">{badgeMonth}</span>
        <span className="text-lg font-semibold leading-none">{badgeDay}</span>
      </div>

      {/* Details */}
      <div className="flex-1">
        <p className="text-sm text-gray-800 dark:text-gray-100">
          {timeStr} · {format} · {capacity} spot{capacity > 1 ? 's' : ''}
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {locationName}
        </p>
        {notes && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {notes}
          </p>
        )}
      </div>

      {/* Placeholder Join button */}
      <Button className="ml-auto whitespace-nowrap">Join</Button>
    </li>
  );
}