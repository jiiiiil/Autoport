"use client";

import Link from "next/link";
import { RequireGuest } from "@/components/auth/auth-guard";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <RequireGuest>
      <AuthShell
        title="Welcome back"
        subtitle="Sign in to continue building your portfolio"
        footer={
          <>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:text-primary-hover transition-colors">
              Create one
            </Link>
          </>
        }
      >
        <LoginForm />
      </AuthShell>
    </RequireGuest>
  );
}
