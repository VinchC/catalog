"use client";

import { useActionState } from "react";

import { authenticate, type LoginState } from "./actions";

// État initial du formulaire.
const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(
    authenticate,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      {/* Adresse e-mail */}
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Adresse e-mail
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          required
          disabled={pending}
          aria-invalid={Boolean(state.error)}
          aria-describedby={state.error ? "login-error" : undefined}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current disabled:opacity-50"
        />
      </div>

      {/* Mot de passe */}
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Mot de passe
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={pending}
          aria-invalid={Boolean(state.error)}
          aria-describedby={state.error ? "login-error" : undefined}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current disabled:opacity-50"
        />
      </div>

      {/* Message d'erreur */}
      {state.error && (
        <p id="login-error" role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      {/* Soumission */}
      <button
        type="submit"
        disabled={pending}
        aria-disabled={pending}
        className="w-full rounded-lg bg-foreground px-4 py-2 text-background transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Connexion en cours..." : "Se connecter"}
      </button>
    </form>
  );
}
