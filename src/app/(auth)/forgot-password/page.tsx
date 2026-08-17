"use client";

import Link from "next/link";
import { RequireGuest } from "@/components/auth/auth-guard";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <RequireGuest>
      <AuthShell
        title="Reset your password"
        subtitle="Enter your email and we will send you a reset link"
        footer={
          <Link href="/login" className="text-primary hover:text-primary-hover transition-colors">
            Remembered your password? Sign in
          </Link>
        }
      >
        <ForgotPasswordForm />
      </AuthShell>
    </RequireGuest>
  );
}
