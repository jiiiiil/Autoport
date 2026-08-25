"use client";

import { useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api-client";
import { AuthInput } from "./auth-input";
import { Button } from "@/components/ui/button";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setEmailError(undefined);

    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Enter a valid email address");
      return;
    }

    setSubmitting(true);
    try {
      const result = await apiRequest<{ resetUrl: string }>("/api/auth/forgot-password", { method: "POST", body: { email } });
      setResetUrl(result.resetUrl);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (resetUrl) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-success/10 border border-success/30 px-4 py-3 text-sm text-success">
          Password reset link generated successfully!
        </div>
        <div className="space-y-2">
          <p className="text-sm text-text-primary font-semibold">Click the link below to reset your password:</p>
          <a
            href={resetUrl}
            className="block w-full text-center px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-semibold"
          >
            Reset Password
          </a>
        </div>
        <div className="text-center text-sm text-text-muted">
          <Link href="/login" className="text-primary hover:text-primary-hover transition-colors">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {serverError ? (
        <div className="rounded-lg bg-error/10 border border-error/30 px-4 py-3 text-sm text-error">{serverError}</div>
      ) : null}

      <AuthInput
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={emailError}
        hint="Enter the email you registered with and we will send you a reset link."
      />

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Sending...
          </>
        ) : (
          "Send reset link"
        )}
      </Button>

      <p className="text-center text-sm text-text-muted">
        <Link href="/login" className="text-primary hover:text-primary-hover transition-colors">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
