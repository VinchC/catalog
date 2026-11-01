"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

// Indique si le composant est exécuté dans le navigateur.
function subscribeToClient() {
  // L'état de disponibilité ne change pas pendant la session.
  // Aucun abonnement n'est donc nécessaire.
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export default function ThemeToggle() {
  const mounted = useSyncExternalStore(
    subscribeToClient,
    getClientSnapshot,
    getServerSnapshot,
  );

  const { resolvedTheme, setTheme } = useTheme();

  // Le rendu serveur et le premier rendu client restent identiques.
  if (!mounted) {
    return (
      <button
        type="button"
        className="rounded-md border border-border px-3 py-2"
        disabled
        aria-label="Chargement du thème"
      >
        Thème
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-md border border-border px-3 py-2"
      aria-label={isDark ? "Activer le thème clair" : "Activer le thème sombre"}
    >
      {isDark ? "☀️ Clair" : "🌙 Sombre"}
    </button>
  );
}
