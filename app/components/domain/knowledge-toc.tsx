"use client";

type TocItem = {
  id: string;
  level: 2 | 3;
  title: string;
};

type KnowledgeTocProps = {
  items: TocItem[];
};

export function KnowledgeToc({ items }: KnowledgeTocProps) {
  function scrollToSection(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();

    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  }

  return (
    <nav aria-label="Inhoudsopgave">
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(event) => scrollToSection(event, item.id)}
              className={`block text-sm transition-colors hover:text-primary ${
                item.level === 3 ? "pl-3 text-foreground/55" : "text-foreground/75"
              }`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
