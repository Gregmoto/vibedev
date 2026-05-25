"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  subscribeLeadMagnet,
  type LeadMagnetState,
} from "@/lib/actions/lead-magnet-actions";
import { cn } from "@/lib/utils";
import type { Resource } from "@/content/resources";

/* ── Submit button ──────────────────────────────────────────────────────────── */

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "h-12 w-full rounded-xl bg-brand px-6 text-sm font-semibold text-bg",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50",
      )}
    >
      {pending ? "Skickar…" : "Ladda ned gratis →"}
    </button>
  );
}

/* ── Modal ──────────────────────────────────────────────────────────────────── */

function DownloadModal({
  resource,
  onClose,
}: {
  resource: Resource;
  onClose: () => void;
}) {
  const initialState: LeadMagnetState = { status: "idle" };
  const [state, formAction] = useActionState(subscribeLeadMagnet, initialState);
  const emailRef = useRef<HTMLInputElement>(null);
  const submitted = state.status === "success" || state.status === "duplicate";

  /* Focus email input on open */
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  /* Close on ESC */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* Prevent body scroll while open */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-[#0F172A]/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div className="relative w-full max-w-md rounded-2xl bg-bg shadow-2xl ring-1 ring-line">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Stäng"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-line hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          {/* Badge + title */}
          <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
            {resource.format} · {resource.pageCount} sidor
          </span>
          <h2
            id="modal-title"
            className="mt-3 font-display text-xl font-bold tracking-tight text-text"
          >
            {resource.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {resource.description}
          </p>

          {/* Success state */}
          {submitted ? (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-green-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-green-800">
                  PDF:en är på väg till din inbox!
                </p>
                {state.status === "duplicate" && (
                  <p className="mt-1 text-xs text-green-700">
                    Du har laddat ned den här guiden förut — vi skickade länken igen.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <form action={formAction} className="mt-6 space-y-3">
              {/* Hidden source */}
              <input type="hidden" name="source" value={resource.source} />

              {/* Name */}
              <div>
                <label htmlFor="modal-name" className="sr-only">Namn</label>
                <input
                  id="modal-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Ditt namn"
                  className={cn(
                    "h-12 w-full rounded-xl border border-line bg-bg px-4 text-sm text-text",
                    "placeholder:text-muted/60",
                    "focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20",
                  )}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="modal-email" className="sr-only">E-postadress</label>
                <input
                  ref={emailRef}
                  id="modal-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="din@email.se"
                  className={cn(
                    "h-12 w-full rounded-xl border border-line bg-bg px-4 text-sm text-text",
                    "placeholder:text-muted/60",
                    "focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20",
                  )}
                />
              </div>

              {/* Error */}
              {state.status === "error" && (
                <p className="text-xs text-red-600" role="alert">
                  {state.message}
                </p>
              )}

              <SubmitButton />

              <p className="text-center text-xs text-muted">
                Vi skickar PDF:en till din e-post direkt. Inga säljmail.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Public component — trigger + modal ────────────────────────────────────── */

type ResourceDownloadModalProps = {
  resource: Resource;
};

export function ResourceDownloadModal({ resource }: ResourceDownloadModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-bg",
          "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50",
        )}
      >
        Ladda ned gratis →
      </button>

      {open && (
        <DownloadModal resource={resource} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
