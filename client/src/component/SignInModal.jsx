import React from 'react';
import { XIcon } from 'lucide-react';
import { SignIn, useAuth } from '@clerk/clerk-react';

const SignInModal = ({ open, onClose }) => {
  const { isLoaded } = useAuth();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Sign in"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-full w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-[#111] p-2 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close sign in"
        >
          <XIcon size={18} />
        </button>

        {isLoaded ? (
          <SignIn routing="hash" signUpUrl="#/sign-up" />
        ) : (
          <div className="px-8 py-16 text-center text-white">
            <h2 className="mb-3 text-xl font-semibold">Sign in is unavailable</h2>
            <p className="text-sm leading-6 text-white/60">
              Add a real Clerk publishable key to client/.env, then restart the client.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignInModal;
