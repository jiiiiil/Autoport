import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-bg-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="text-white text-sm font-semibold tracking-tight">
                AI Portfolio
              </span>
            </Link>
            <p className="text-text-muted text-xs max-w-xs">
              Build your portfolio with the power of AI. Create stunning,
              personalized portfolio websites in minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex flex-col gap-3">
              <span className="text-white text-xs font-medium uppercase tracking-wider">
                Product
              </span>
              <Link
                href="#"
                className="text-text-muted text-xs hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                href="#"
                className="text-text-muted text-xs hover:text-white transition-colors"
              >
                Pricing
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-white text-xs font-medium uppercase tracking-wider">
                Company
              </span>
              <Link
                href="#"
                className="text-text-muted text-xs hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href="#"
                className="text-text-muted text-xs hover:text-white transition-colors"
              >
                Blog
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs">
            &copy; {new Date().getFullYear()} AI Portfolio. All rights reserved.
          </p>
          <p className="text-text-muted text-xs">
            Built with AI
          </p>
        </div>
      </div>
    </footer>
  );
}
