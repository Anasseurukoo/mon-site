import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/ui/ContactForm";
import { profile, socials } from "@/data/profile";
import { cn } from "@/lib/utils";

interface ContactSectionProps {
  /**
   * False only on the /contact route, where PageHeader already rendered this
   * exact title and intro. True (default) everywhere else — this section
   * closes every other page and is the only heading it has there.
   */
  showHeading?: boolean;
}

export function ContactSection({ showHeading = true }: ContactSectionProps) {
  return (
    <section
      id="contact"
      className={cn(
        "relative overflow-hidden",
        showHeading ? "py-section" : "pb-section pt-8 sm:pt-10",
      )}
      aria-labelledby="contact-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent"
        aria-hidden="true"
      />

      <div className="shell">
        {showHeading && (
          <SectionHeading
            id="contact-heading"
            label="07 — Contact"
            title="Un problème intéressant"
            accent="à résoudre ensemble ?"
            align="stacked"
            className="mb-16"
          />
        )}

        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-24">
          {/* --------------------------------------------------- direct info */}
          <div>
            <Reveal>
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex flex-wrap items-baseline gap-3 font-display text-[clamp(1.5rem,3.2vw,2.5rem)] leading-tight text-ivory transition-colors hover:text-gold-soft"
              >
                {profile.email}
                <span
                  aria-hidden="true"
                  className="text-gold transition-transform duration-400 group-hover:-translate-y-1 group-hover:translate-x-1"
                >
                  ↗
                </span>
              </a>
            </Reveal>

            {showHeading && (
              <Reveal delay={0.1}>
                <p className="mt-8 max-w-md leading-relaxed text-steel">
                  Disponible pour opportunités IT, collaborations web et projets techniques.
                </p>
              </Reveal>
            )}

            <Reveal delay={0.15}>
              <dl className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2">
                <div className="bg-sumi p-5">
                  <dt className="label text-steel-dim">Localisation</dt>
                  <dd className="mt-2 text-sm text-ivory-dim">{profile.location}</dd>
                </div>
                <div className="bg-sumi p-5">
                  <dt className="label text-steel-dim">Disponibilité</dt>
                  <dd className="mt-2 text-sm text-ivory-dim">{profile.availability}</dd>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={0.2}>
              <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                {socials.map((social) => (
                  <li key={social.href}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-baseline gap-2 py-1 text-sm text-ivory-dim transition-colors hover:text-gold-soft"
                    >
                      {social.label}
                      <span className="label text-steel-dim">{social.handle}</span>
                      <span aria-hidden="true" className="text-gold/70">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* --------------------------------------------------------- form */}
          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
