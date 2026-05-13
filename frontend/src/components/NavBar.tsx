"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/", label: "Browse" },
  { href: "/compare", label: "Compare" },
  { href: "/bookmarks", label: "Bookmarks" },
];

export default function NavBar() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="rounded bg-hf-yellow px-1.5 py-0.5 text-sm font-black text-hf-dark">
            HF
          </span>
          AI Explorer
        </Link>
        <nav className="flex gap-4">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "text-sm font-medium transition-colors",
                path === href
                  ? "text-hf-dark underline underline-offset-4"
                  : "text-gray-500 hover:text-hf-dark"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
