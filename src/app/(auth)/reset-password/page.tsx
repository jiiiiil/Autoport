"use client";

import Link from "next/link";
import { RequireGuest } from "@/components/auth/auth-guard";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <RequireGuest>
      <AuthShell title="Set a new password" subtitle="Choose a strong password for your account">
        <ResetPasswordForm />
        <div className="mt-6 text-center text-sm text-text-muted">
          <Link href="/login" className="text-primary hover:text-primary-hover transition-colors">
            Back to sign in
          </Link>
        </div>
      </AuthShell>
    </RequireGuest>
  );
}
