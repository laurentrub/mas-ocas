import type { ReactNode } from "react";

type LegalPageProps = {
  eyebrow?: string;
  title: string;
  intro: ReactNode;
  children: ReactNode;
  updatedAt?: string;
};

export function LegalPage({
  eyebrow = "Informations légales",
  title,
  intro,
  children,
  updatedAt = "23 septembre 2026",
}: LegalPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-signal">
        {eyebrow}
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink">
        {title}
      </h1>
      <div className="mt-4 text-muted-foreground leading-relaxed">{intro}</div>
      {updatedAt ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Dernière mise à jour : {updatedAt}
        </p>
      ) : null}
      <div className="mt-12 space-y-10 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-foreground/90">{children}</div>
    </section>
  );
}
