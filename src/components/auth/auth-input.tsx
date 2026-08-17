"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, hint, type = "text", className, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;
    const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              "w-full rounded-lg bg-bg-card border px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted/50",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
              "transition-colors duration-150",
              error ? "border-error" : "border-border",
              isPassword ? "pr-11" : "",
              className
            )}
            aria-invalid={error ? true : undefined}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          ) : null}
        </div>
        {error ? <p className="text-xs text-error">{error}</p> : hint ? <p className="text-xs text-text-muted">{hint}</p> : null}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
