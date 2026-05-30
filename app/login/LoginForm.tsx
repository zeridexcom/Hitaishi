"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Field, Input, Button } from "@/components/ui";
import { loginAction, type LoginState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? "Signing in\u2026" : "Sign in"}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState<LoginState, FormData>(loginAction, undefined);
  const [show, setShow] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Email" required>
        <Input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@school.edu"
        />
      </Field>
      <Field label="Password" required>
        <div className="relative">
          <Input
            name="password"
            type={show ? "text" : "password"}
            required
            autoComplete="current-password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShow((p) => !p)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-ink-faint hover:text-ink hover:bg-surface-elevated transition-colors"
            aria-label={show ? "Hide password" : "Show password"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              {show ? (
                <>
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                </>
              ) : (
                <>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        </div>
      </Field>
      {state?.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
