import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <span className="text-text-primary text-xs font-bold">A</span>
              </div>
              <span className="text-text-primary text-sm font-semibold tracking-tight">
                AI Portfolio
              </span>
            </Link>
            <p className="text-text-primary text-xs max-w-xs font-semibold">
              Build your portfolio with the power of AI. Create stunning,
              personalized portfolio websites in minutes.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-primary text-xs font-semibold">
            &copy; {new Date().getFullYear()} AI Portfolio. All rights reserved.
          </p>
            <Link
                href="/about"
                className="text-text-primary text-xs hover:text-primary transition-colors font-semibold"
              >
                About
              </Link>
        </div>
      </div>
    </footer>
  );
}
