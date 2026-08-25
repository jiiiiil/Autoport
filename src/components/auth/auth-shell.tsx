"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-screen w-full bg-bg relative overflow-hidden flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, #9333ea 0%, transparent 60%)" }}
        />
        <div
          className="absolute -bottom-40 -right-24 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-25"
          style={{ background: "radial-gradient(circle, #e11d48 0%, transparent 60%)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white text-lg font-bold">A</span>
            </div>
            <span className="text-text-primary text-lg font-semibold tracking-tight">AI Portfolio</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-text">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-text-muted">{subtitle}</p> : null}
        </div>

        <div className="glass-strong rounded-2xl p-6 md:p-8 shadow-xl">{children}</div>

        {footer ? <div className="mt-6 text-center text-sm text-text-muted">{footer}</div> : null}
      </motion.div>
    </div>
  );
}
