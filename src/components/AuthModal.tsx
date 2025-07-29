'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

/**
 * A modal that handles Sign-Up, Log-In, and Forgot-Password flows
 * using Supabase email-and-password auth.
 */
export default function AuthModal() {
  type Mode = 'login' | 'signup' | 'forgot';
  const [mode, setMode] = useState<Mode>('login');
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const supabase = createPagesBrowserClient();

  const close = () => {
    // reset fields when closing
    setEmail('');
    setPassword('');
    setConfirm('');
    setMode('login');
    setOpen(false);
  };

  const handleAuth = async () => {
    if (mode === 'signup' && password !== confirm) {
      alert('Passwords do not match');
      return;
    }

    let errorMsg = '';
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      errorMsg = error?.message ?? '';
    } else if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      errorMsg = error?.message ?? '';
    } else if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      errorMsg = error?.message ?? '';
      if (!errorMsg) {
        alert('Reset-password e-mail sent (check spam).');
      }
    }

    if (errorMsg) {
      alert(errorMsg);
    } else if (mode !== 'forgot') {
      close(); // close modal on successful login/signup
    }
  };

  return (
    <>
      {/* The button you place in your header or nav */}
      <button
        className="rounded bg-indigo-600 px-3 py-1 text-white"
        onClick={() => setOpen(true)}
      >
        {mode === 'login' ? 'Log In' : mode === 'signup' ? 'Sign Up' : 'Forgot Password'}
      </button>

      {/* ---- modal ---- */}
      <Dialog open={open} onClose={close} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded bg-white p-6 shadow">
            <Dialog.Title className="mb-4 text-lg font-semibold text-center">
              {mode === 'login'
                ? 'Log In'
                : mode === 'signup'
                ? 'Create Account'
                : 'Reset Password'}
            </Dialog.Title>

            {/* e-mail */}
            <input
              className="mb-3 w-full rounded border p-2"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* password fields */}
            {mode !== 'forgot' && (
              <>
                <input
                  className="mb-3 w-full rounded border p-2"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {mode === 'signup' && (
                  <input
                    className="mb-3 w-full rounded border p-2"
                    type="password"
                    placeholder="Confirm password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                )}
              </>
            )}

            {/* action button */}
            <button
              className="mt-2 w-full rounded bg-indigo-600 py-2 font-medium text-white"
              onClick={handleAuth}
            >
              {mode === 'login'
                ? 'Log In'
                : mode === 'signup'
                ? 'Sign Up'
                : 'Send Reset Link'}
            </button>

            {/* footer links */}
            <p className="mt-4 text-center text-sm">
              {mode === 'login' && (
                <>
                  No account?{' '}
                  <button
                    className="underline"
                    onClick={() => setMode('signup')}
                  >
                    Sign up
                  </button>{' '}
                  ·{' '}
                  <button
                    className="underline"
                    onClick={() => setMode('forgot')}
                  >
                    Forgot password?
                  </button>
                </>
              )}

              {mode === 'signup' && (
                <>
                  Already have an account?{' '}
                  <button
                    className="underline"
                    onClick={() => setMode('login')}
                  >
                    Log in
                  </button>
                </>
              )}

              {mode === 'forgot' && (
                <>
                  Remembered?{' '}
                  <button
                    className="underline"
                    onClick={() => setMode('login')}
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
