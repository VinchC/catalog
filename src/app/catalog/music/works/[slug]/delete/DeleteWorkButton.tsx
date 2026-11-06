"use client";

import { deleteMusicalWork } from "./actions";

type Props = {
  slug: string;
};

export default function DeleteWorkButton({ slug }: Props) {
  return (
    <form
      action={deleteMusicalWork}
      onSubmit={(event) => {
        if (!window.confirm("Confirmer la suppression de cette œuvre ?")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="slug" value={slug} />

      <button
        type="submit"
        className="rounded-lg border border-red-500 px-4 py-2 text-red-600 transition-colors hover:bg-red-500/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
      >
        Supprimer cette œuvre
      </button>
    </form>
  );
}