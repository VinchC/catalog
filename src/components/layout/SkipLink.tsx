"use client";

export default function SkipLink() {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    const mainContent = document.getElementById("main-content");

    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
      window.history.replaceState(null, "", "#main-content");
    }
  }

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-lg focus:border focus:border-border focus:bg-background focus:px-4 focus:py-3 focus:font-medium focus:text-foreground focus:outline-2 focus:outline-offset-2 focus:outline-current"
    >
      Aller au contenu principal
    </a>
  );
}
