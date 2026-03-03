import { cn } from "@/lib/utils";
import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";

type LegalSectionProps = {
  id?: string;
  number?: string | number;
  title: string;
  content: string | React.ReactNode;
  className?: string;
};

export function LegalSection({
  id,
  number,
  title,
  content,
  className,
}: LegalSectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24", className)}
    >
      <h2 className="text-xl font-heading font-bold text-foreground mb-4 flex items-baseline gap-3">
        {number && (
          <span className="text-primary/60 text-lg font-normal">{number}.</span>
        )}
        <span>{title}</span>
      </h2>
      <div className="prose prose-invert prose-sm max-w-none">
        {typeof content === "string" ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          content
        )}
      </div>
    </section>
  );
}

type LegalSubsectionProps = {
  id?: string;
  number?: string;
  title: string;
  content: string | React.ReactNode;
  className?: string;
};

export function LegalSubsection({
  id,
  number,
  title,
  content,
  className,
}: LegalSubsectionProps) {
  return (
    <div id={id} className={cn("scroll-mt-24 mt-6", className)}>
      <h3 className="text-lg font-heading font-semibold text-foreground mb-3 flex items-baseline gap-2">
        {number && (
          <span className="text-foreground/40 text-base font-normal">
            {number}
          </span>
        )}
        <span>{title}</span>
      </h3>
      <div className="prose prose-invert prose-sm max-w-none pl-6 border-l border-border">
        {typeof content === "string" ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          content
        )}
      </div>
    </div>
  );
}

type TableOfContentsItem = {
  id: string;
  title: string;
  number?: string | number;
  children?: TableOfContentsItem[];
};

type LegalTableOfContentsProps = {
  items: TableOfContentsItem[];
  title?: string;
  className?: string;
};

export function LegalTableOfContents({
  items,
  title = "Inhoud",
  className,
}: LegalTableOfContentsProps) {
  const renderItem = (item: TableOfContentsItem, depth = 0) => (
    <li key={item.id}>
      <a
        href={`#${item.id}`}
        className={cn(
          "flex items-baseline gap-2 py-1.5 text-foreground/70 hover:text-primary transition-colors",
          depth > 0 && "pl-4 text-sm"
        )}
      >
        {item.number && (
          <span className="text-foreground/40 min-w-[2rem]">{item.number}.</span>
        )}
        <span>{item.title}</span>
      </a>
      {item.children && item.children.length > 0 && (
        <ul className="border-l border-border/50 ml-4">
          {item.children.map((child) => renderItem(child, depth + 1))}
        </ul>
      )}
    </li>
  );

  return (
    <nav className={cn("rounded-luxury bg-surface/50 border border-border p-6", className)}>
      <h2 className="text-lg font-heading font-bold text-foreground mb-4">
        {title}
      </h2>
      <ol className="space-y-1">{items.map((item) => renderItem(item))}</ol>
    </nav>
  );
}

type LegalDocumentHeaderProps = {
  title: string;
  lastUpdated?: string;
  version?: string;
  className?: string;
};

export function LegalDocumentHeader({
  title,
  lastUpdated,
  version,
  className,
}: LegalDocumentHeaderProps) {
  return (
    <header className={cn("mb-8", className)}>
      <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
        {title}
      </h1>
      <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60">
        {lastUpdated && (
          <div className="flex items-center gap-1.5">
            <span>Laatst bijgewerkt:</span>
            <time className="text-foreground/80">{lastUpdated}</time>
          </div>
        )}
        {version && (
          <div className="flex items-center gap-1.5">
            <span>Versie:</span>
            <span className="text-foreground/80">{version}</span>
          </div>
        )}
      </div>
    </header>
  );
}

type LegalContactBlockProps = {
  title?: string;
  description?: string;
  email?: string;
  className?: string;
};

export function LegalContactBlock({
  title = "Vragen?",
  description = "Heb je vragen over deze voorwaarden? Neem contact met ons op.",
  email,
  className,
}: LegalContactBlockProps) {
  return (
    <div
      className={cn(
        "rounded-luxury bg-surface/50 border border-border p-6 mt-12",
        className
      )}
    >
      <h3 className="text-lg font-heading font-bold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-foreground/70 mb-4">{description}</p>
      {email && (
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors"
        >
          <span>{email}</span>
          <ChevronRight className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}

type RelatedLegalDocument = {
  title: string;
  href: string;
  description?: string;
};

type RelatedLegalDocumentsProps = {
  documents: RelatedLegalDocument[];
  title?: string;
  className?: string;
};

export function RelatedLegalDocuments({
  documents,
  title = "Gerelateerde documenten",
  className,
}: RelatedLegalDocumentsProps) {
  return (
    <div className={cn("mt-12", className)}>
      <h3 className="text-lg font-heading font-bold text-foreground mb-4">
        {title}
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {documents.map((doc, index) => (
          <Link
            key={index}
            href={doc.href}
            className="group flex items-start gap-3 p-4 rounded-lg bg-surface/50 border border-white/5 transition-all hover:border-primary/20 hover:bg-surface"
          >
            <FileText className="w-5 h-5 text-foreground/40 group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="font-medium text-foreground group-hover:text-primary transition-colors block">
                {doc.title}
              </span>
              {doc.description && (
                <span className="text-sm text-foreground/50 line-clamp-1 mt-0.5 block">
                  {doc.description}
                </span>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}

type LegalList = {
  items: string[];
  ordered?: boolean;
  className?: string;
};

export function LegalList({ items, ordered = false, className }: LegalList) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag
      className={cn(
        "space-y-2 my-4",
        ordered ? "list-decimal" : "list-disc",
        "pl-6 text-foreground/80",
        className
      )}
    >
      {items.map((item, index) => (
        <li key={index} className="text-sm leading-relaxed">
          {item}
        </li>
      ))}
    </Tag>
  );
}

type LegalHighlightProps = {
  type?: "info" | "warning" | "important";
  children: React.ReactNode;
  className?: string;
};

export function LegalHighlight({
  type = "info",
  children,
  className,
}: LegalHighlightProps) {
  const typeStyles = {
    info: "bg-blue-500/10 border-blue-500/30 text-blue-200",
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-200",
    important: "bg-primary/10 border-primary/30 text-primary",
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-4 my-4 text-sm",
        typeStyles[type],
        className
      )}
    >
      {children}
    </div>
  );
}
