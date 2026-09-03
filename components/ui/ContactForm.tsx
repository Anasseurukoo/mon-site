"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useRef, useState } from "react";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { profile } from "@/data/profile";

type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: Record<Field, string>): Errors {
  const errors: Errors = {};

  if (!values.name.trim()) {
    errors.name = "Indiquez votre nom.";
  } else if (values.name.trim().length < 2) {
    errors.name = "Le nom doit contenir au moins 2 caractères.";
  }

  if (!values.email.trim()) {
    errors.email = "Indiquez une adresse e-mail.";
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = "Cette adresse e-mail ne semble pas valide.";
  }

  if (!values.message.trim()) {
    errors.message = "Écrivez quelques mots sur votre projet.";
  } else if (values.message.trim().length < 12) {
    errors.message = "Le message doit contenir au moins 12 caractères.";
  }

  return errors;
}

/**
 * Contact form for the static portfolio.
 *
 * After validation, the message is handed off to the visitor’s default mail
 * application via mailto. This keeps the GitHub Pages build fully static while
 * avoiding a fake “message sent” state when no backend exists.
 *
 * Accessibility: each field owns its error via aria-describedby, invalid
 * fields get aria-invalid, the first invalid field receives focus on a failed
 * submit, and the result is announced through a polite live region.
 */
export function ContactForm() {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);

  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [state, setState] = useState<"idle" | "handoff">("idle");

  const fieldId = (field: Field) => `${uid}-${field}`;
  const errorId = (field: Field) => `${uid}-${field}-error`;

  const update = (field: Field, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors(validate({ ...values, [field]: value }));
    }
  };

  const blur = (field: Field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(values));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, email: true, message: true });

    const firstInvalid = (["name", "email", "message"] as Field[]).find((f) => found[f]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fieldId(firstInvalid))}`)?.focus();
      return;
    }

    const subject = encodeURIComponent(`Contact BuiltByAnas — ${values.name.trim()}`);
    const body = encodeURIComponent(
      `Nom : ${values.name.trim()}\nE-mail : ${values.email.trim()}\n\n${values.message.trim()}`,
    );

    setState("handoff");
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const reset = () => {
    setValues({ name: "", email: "", message: "" });
    setErrors({});
    setTouched({});
    setState("idle");
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {state === "handoff" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE.dojo }}
            className="border border-gold/40 p-8 sm:p-10"
          >
            <p className="label mb-4 text-gold">Message prêt</p>
            <p className="font-display text-2xl leading-snug text-ivory">
              Votre application e-mail a été ouverte.
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-steel">
              Le message a été préparé pour {profile.email}. Vérifiez-le puis envoyez-le
              depuis votre application de messagerie.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-7 border border-line-strong px-5 py-3 text-sm text-ivory-dim transition-colors hover:border-gold hover:text-ivory"
            >
              Recommencer
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6"
          >
            <Field
              id={fieldId("name")}
              errorId={errorId("name")}
              label="Nom"
              value={values.name}
              error={touched.name ? errors.name : undefined}
              onChange={(v) => update("name", v)}
              onBlur={() => blur("name")}
              autoComplete="name"
            />

            <Field
              id={fieldId("email")}
              errorId={errorId("email")}
              label="E-mail"
              type="email"
              value={values.email}
              error={touched.email ? errors.email : undefined}
              onChange={(v) => update("email", v)}
              onBlur={() => blur("email")}
              autoComplete="email"
            />

            <Field
              id={fieldId("message")}
              errorId={errorId("message")}
              label="Message"
              multiline
              value={values.message}
              error={touched.message ? errors.message : undefined}
              onChange={(v) => update("message", v)}
              onBlur={() => blur("message")}
            />

            <button
              type="submit"
              className="group mt-2 inline-flex items-center justify-center gap-3 border border-gold bg-gold px-7 py-4 text-sm font-medium text-sumi transition-colors hover:bg-gold-soft"
            >
              Préparer l’e-mail
              <span
                aria-hidden="true"
                className="transition-transform duration-400 group-hover:translate-x-1"
              >
                →
              </span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Announces validation and submission outcomes to screen readers. */}
      <p role="status" aria-live="polite" className="sr-only">
        {state === "handoff"
          ? "Formulaire validé. Votre application e-mail a été ouverte avec le message préparé."
          : Object.keys(errors).length > 0 && Object.keys(touched).length > 0
            ? `Le formulaire contient ${Object.keys(errors).length} erreur(s).`
            : ""}
      </p>
    </div>
  );
}

interface FieldProps {
  id: string;
  errorId: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
}

function Field({
  id,
  errorId,
  label,
  value,
  error,
  onChange,
  onBlur,
  type = "text",
  multiline = false,
  autoComplete,
}: FieldProps) {
  const shared = {
    id,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    onBlur,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: cn(
      "w-full border-b bg-transparent px-0 py-3.5 text-ivory outline-none transition-colors",
      "placeholder:text-steel-dim focus:border-gold",
      error ? "border-vermilion" : "border-line-strong hover:border-steel",
    ),
  };

  return (
    <div>
      <label htmlFor={id} className="label mb-1 block text-steel">
        {label}
      </label>

      {multiline ? (
        <textarea {...shared} rows={5} className={cn(shared.className, "resize-y")} />
      ) : (
        <input {...shared} type={type} autoComplete={autoComplete} />
      )}

      {error && (
        <p id={errorId} className="mt-2 flex items-center gap-2 text-xs text-vermilion-text">
          <span aria-hidden="true">!</span>
          {error}
        </p>
      )}
    </div>
  );
}
