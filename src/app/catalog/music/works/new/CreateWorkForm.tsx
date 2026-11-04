"use client";

import { useActionState } from "react";
import { createMusicalWork, type CreateWorkState } from "./actions";

type Option = {
  id: string;
  name: string;
};

type Props = {
  artists: Option[];
  genres: Option[];
};

const initialState: CreateWorkState = {};

export default function CreateWorkForm({ artists, genres }: Props) {
  const [state, formAction, pending] = useActionState(
    createMusicalWork,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="title" className="mb-2 block font-medium">
          Titre
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={200}
          disabled={pending}
          aria-describedby={state.error ? "create-work-error" : undefined}
          className="w-full rounded-lg border border-border bg-background p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="year" className="mb-2 block font-medium">
          Année de sortie
        </label>
        <input
          id="year"
          name="year"
          type="number"
          min="1"
          max="3000"
          required
          disabled={pending}
          aria-describedby={state.error ? "create-work-error" : undefined}
          className="w-full rounded-lg border border-border bg-background p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="artistId" className="mb-2 block font-medium">
          Artiste
        </label>
        <select
          id="artistId"
          name="artistId"
          required
          defaultValue=""
          disabled={pending}
          aria-describedby={state.error ? "create-work-error" : undefined}
          className="w-full rounded-lg border border-border bg-background p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current disabled:opacity-50"
        >
          <option value="" disabled>
            Sélectionner un artiste
          </option>
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>
      </div>

      <fieldset disabled={pending}>
        <legend className="mb-3 font-medium">Genres musicaux</legend>
        <div className="space-y-2">
          {genres.map((genre) => (
            <label key={genre.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="genreIds"
                value={genre.id}
                className="size-4 accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
              />
              {genre.name}
            </label>
          ))}
        </div>
      </fieldset>

      {state.error && (
        <p id="create-work-error" role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        aria-disabled={pending}
        className="rounded-lg bg-foreground px-5 py-3 text-background transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Enregistrement..." : "Créer l’œuvre"}
      </button>
    </form>
  );
}
