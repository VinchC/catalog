"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateArtist } from "./actions";
import { ArtistFormState } from "./type";

type Artist = {
  id: string;
  name: string;
  country: string;
  startYear: number;
  endYear: number | null;
};

type Props = {
  artist: Artist;
};

export default function EditArtistForm({ artist }: Props) {
  const initialState: ArtistFormState = {};

  const [state, formAction, pending] = useActionState(
    updateArtist,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={artist.id} />

      <div className="space-y-2">
        <label htmlFor="name" className="block font-medium">
          Nom de l&apos;artiste
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={artist.name}
          required
          maxLength={120}
          disabled={pending}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="country" className="block font-medium">
          Pays
        </label>
        <input
          id="country"
          name="country"
          type="text"
          defaultValue={artist.country}
          required
          maxLength={100}
          disabled={pending}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="startYear" className="block font-medium">
          Année de début
        </label>
        <input
          id="startYear"
          name="startYear"
          type="number"
          min="1"
          max="2100"
          defaultValue={artist.startYear}
          required
          disabled={pending}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="endYear" className="block font-medium">
          Année de fin (facultatif)
        </label>
        <input
          id="endYear"
          name="endYear"
          type="number"
          min="1"
          max="2100"
          defaultValue={artist.endYear ?? ""}
          disabled={pending}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-red-600">
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg border border-border px-4 py-2 font-medium transition-colors hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>

        <Link href="/catalog/music" className="underline underline-offset-4">
          Annuler
        </Link>
      </div>
    </form>
  );
}
