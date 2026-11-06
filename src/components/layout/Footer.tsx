import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm">
        <p>{siteConfig.name} — Application de démonstration évolutive.</p>
      </div>
    </footer>
  );
}