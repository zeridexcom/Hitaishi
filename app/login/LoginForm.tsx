"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Field, Input, Button } from "@/components/ui";
import { loginAction, type LoginState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full bg-primary hover:bg-primary-hover shadow-soft">
      {pending ? "Signing in\u2026" : "Sign in"}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState<LoginState, FormData>(loginAction, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Email Address" required>
        <div className="relative">
          <Input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Enter Email / Phone No"
            className="pr-10"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-rule-strong bg-transparent pointer-events-none" />
        </div>
      </Field>

      <Field label="Password" required>
        <div className="relative">
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="Passcode"
            className="pr-14"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-ink-soft hover:text-primary transition-colors"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </Field>

      <div className="text-left">
        <a 
          href="/contact?subject=Login%20Trouble"
          className="text-xs text-ink-soft hover:text-primary hover:underline transition-colors"
        >
          Having trouble in sign in?
        </a>
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-error bg-error-soft/50 border border-error/15 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <div className="mt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
