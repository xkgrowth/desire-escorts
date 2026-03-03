import Link from "next/link";
import { DesireLogoAnimated } from "./desire-logo";

export function SiteHeader() {
  return (
    <header className="w-full border-b border-white/10 bg-background">
      <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-3">
        <Link href="/" aria-label="Go to homepage">
          <DesireLogoAnimated size="md" />
        </Link>
      </div>
    </header>
  );
}
