"use client";

import { useState } from "react";

type Action = "created" | "updated" | "deleted";
type ItemType = "œuvre" | "artiste" | "genre";

type Props = {
  action: Action;
  itemType: ItemType;
};

const messages: Record<ItemType, Record<Action, string>> = {
  œuvre: {
    created: "L’œuvre a bien été créée.",
    updated: "L’œuvre a bien été modifiée.",
    deleted: "L’œuvre a bien été supprimée.",
  },
  artiste: {
    created: "L’artiste a bien été créé.",
    updated: "L’artiste a bien été modifié.",
    deleted: "L’artiste a bien été supprimé.",
  },
  genre: {
    created: "Le genre a bien été créé.",
    updated: "Le genre a bien été modifié.",
    deleted: "Le genre a bien été supprimé.",
  },
};

export default function ActionNotice({ action, itemType }: Props) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="flex items-center justify-between gap-4 rounded-lg border border-border bg-foreground/5 p-4"
    >
      <p>{messages[itemType][action]}</p>

      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Fermer le message de confirmation"
        className="shrink-0 rounded p-1 text-lg leading-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
      >
        ×
      </button>
    </div>
  );
}
