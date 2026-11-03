
"use client";

import { useActionState } from "react";

import {
  authenticate,
  type LoginState,
} from "./actions";

// État initial du formulaire
const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(
    authenticate,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium"
        >
          Adresse e-mail
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-border bg-background px-3 py-2"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium"
        >
          Mot de passe
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-border bg-background px-3 py-2"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-foreground px-4 py-2 text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Connexion en cours..." : "Se connecter"}
      </button>
    </form>
  );
}