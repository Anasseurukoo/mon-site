const FLOW = [
  { index: "01", title: "Cadrer", detail: "Besoin · contraintes · parcours" },
  { index: "02", title: "Concevoir", detail: "Architecture · données · UX" },
  { index: "03", title: "Construire", detail: "Interface · API · intégrations" },
  { index: "04", title: "Sécuriser", detail: "Contrôles · logs · validation" },
  { index: "05", title: "Faire évoluer", detail: "Livraison · mesure · itération" },
];

/** Keeps the existing end-to-end engineering phases separate from the ticker. */
export function EngineeringPath() {
  return (
    <section
      className="engineering-path border-b border-line py-10 sm:py-12"
      aria-labelledby="engineering-path-title"
    >
      <div className="shell">
        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-4">
          <p className="label text-gold">Du besoin au produit</p>
          <h2 id="engineering-path-title" className="font-display text-xl text-ivory sm:text-2xl">
            Une pratique de bout en bout.
          </h2>
        </div>

        <ol className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {FLOW.map((step, index) => (
            <li
              key={step.index}
              className="relative min-h-28 bg-sumi/70 p-5 sm:min-h-32 sm:p-6"
            >
              <p className="label text-steel-dim">{step.index} / {step.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-ivory-dim">{step.detail}</p>
              {index < FLOW.length - 1 && (
                <span
                  className="absolute right-3 top-4 hidden font-mono text-sm text-gold/70 lg:block"
                  aria-hidden="true"
                >
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
