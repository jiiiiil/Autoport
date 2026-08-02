"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/upload", label: "Upload Resume" },
  { href: "/generation", label: "Generation Lab" },
  { href: "/preview", label: "Preview" },
];

export function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    return pathname === href;
  };

  return (
    <nav className="w-full bg-bg-dark">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 h-14">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <span className="text-white text-sm font-semibold tracking-tight">
            AI Portfolio
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors",
                isActive(link.href)
                  ? "text-white font-medium"
                  : "text-text-muted hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center">
          <Link
            href="/upload"
            className="inline-flex items-center justify-center rounded-lg bg-primary text-white text-sm font-medium px-4 py-2 hover:bg-primary-hover transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
