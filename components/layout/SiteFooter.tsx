import Link from "next/link";
import { BrandMark } from "@/components/common/BrandMark";
import { footerLegal, navigation } from "@/data/navigation";
import { profile, socials } from "@/data/profile";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line bg-sumi-deep">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="shell relative py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <BrandMark />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-steel">
              {profile.name} — ingénieur IT, {profile.locationShort}. Le Digital Dojo est
              une discipline&nbsp;: comprendre, construire, documenter.
            </p>
            <p className="font-jp mt-6 text-2xl text-gold/60" aria-hidden="true">
              道場
            </p>
          </div>

          <nav aria-label="Navigation de pied de page">
            <h2 className="label mb-5 text-steel-dim">Navigation</h2>
            <ul className="flex flex-col gap-2.5">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block py-1 text-sm text-ivory-dim transition-colors hover:text-gold-soft"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="label mb-5 text-steel-dim">Contact</h2>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-block py-1 text-sm text-ivory-dim transition-colors hover:text-gold-soft"
                >
                  {profile.email}
                </a>
              </li>
              {socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block py-1 text-sm text-ivory-dim transition-colors hover:text-gold-soft"
                  >
                    {social.label}{" "}
                    <span aria-hidden="true" className="text-gold/60">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
              <li className="mt-1 text-sm text-steel">{profile.location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-steel-dim">
            © {year} {profile.name}. Built with discipline.
          </p>

          <div className="flex items-center gap-6">
            {footerLegal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="label text-steel-dim transition-colors hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="#main"
              className="label inline-block py-1.5 text-steel-dim transition-colors hover:text-gold"
            >
              Retour en haut ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
