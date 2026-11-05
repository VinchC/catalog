"use client";

import { useActionState } from "react";
import { deleteArtist, type DeleteArtistState } from "./actions";

type Props = {
  id: string;
  name: string;
};

const initialState: DeleteArtistState = {};

export default function DeleteArtistButton({ id, name }: Props) {
  const [state, formAction, pending] = useActionState(
    deleteArtist,
    initialState,
  );

  return (
    <div className="space-y-2">
      <form
        action={formAction}
        onSubmit={(event) => {
          if (
            !window.confirm(`Supprimer définitivement l'artiste « ${name} » ?`)
          ) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="id" value={id} />

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg border border-red-600 px-3 py-1 text-sm text-red-600 transition-colors hover:bg-red-600/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Suppression..." : "Supprimer"}
        </button>
      </form>

      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
    </div>
  );
}
