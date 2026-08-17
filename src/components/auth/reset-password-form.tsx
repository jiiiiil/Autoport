"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/api-client";
import { AuthInput } from "./auth-input";
import { Button } from "@/components/ui/button";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const validate = (): boolean => {
    const errors: { password?: string; confirmPassword?: string } = {};
    if (password.length < 8) errors.password = "Password must be at least 8 characters";
    else if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      errors.password = "Password must contain at least one letter and one number";
    }
    if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!token) {
      setServerError("Missing reset token. Use the link from your email.");
      return;
    }
    if (!validate()) return;

    setSubmitting(true);
    try {
      await apiRequest("/api/auth/reset-password", { method: "POST", body: { token, password } });
      setDone(true);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-success/10 border border-success/30 px-4 py-3 text-sm text-success">
          Your password has been reset successfully. You can now sign in.
        </div>
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-primary text-white text-sm font-medium px-5 py-2.5 hover:bg-primary-hover transition-colors"
          >
            Sign in
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
        label="New password"
        name="newPassword"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters with a letter and number"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={fieldErrors.password}
        hint="Use at least 8 characters including a letter and a number."
      />

      <AuthInput
        label="Confirm new password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        placeholder="Re-enter your new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={fieldErrors.confirmPassword}
      />

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Resetting...
          </>
        ) : (
          "Reset password"
        )}
      </Button>
    </form>
  );
}
