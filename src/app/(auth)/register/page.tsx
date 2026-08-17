"use client";

import Link from "next/link";
import { RequireGuest } from "@/components/auth/auth-guard";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <RequireGuest>
      <AuthShell
        title="Create your account"
        subtitle="Start generating AI-powered portfolios in minutes"
        footer={
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary-hover transition-colors">
              Sign in
            </Link>
          </>
        }
      >
        <RegisterForm />
      </AuthShell>
    </RequireGuest>
  );
}
