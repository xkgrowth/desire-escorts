import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="w-full border-b border-black/10">
      <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-3">
        <Link href="/" aria-label="Go to homepage">
          <Image
            src="/brand/logo.svg"
            alt="Desire Escorts"
            width={272}
            height={30}
            priority
          />
        </Link>
      </div>
    </header>
  );
}
