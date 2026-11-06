import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center gap-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-foreground/60">
        Erreur 404
      </p>

      <h1 className="text-4xl font-bold">Page introuvable</h1>

      <p className="max-w-md text-foreground/70">
        La page que tu recherches n&apos;existe pas ou n&apos;est plus
        accessible.
      </p>

      <Link
        href="/"
        className="rounded-lg border border-border px-5 py-3 transition-colors hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
      >
        Retour à l&apos;accueil
      </Link>
    </section>
  );
}
