import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact-form";
import { company, companyTelHref } from "@/lib/company";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Demande d'information, essai ou livraison : contactez MAS OCAS AUTO au Mans.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-signal">
            Contact
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Demande d&apos;information
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Une question sur un véhicule du stock, une livraison ou une reprise ?
            Laissez-nous un message : nous vous répondons sous 24 h ouvrées.
          </p>

          <dl className="mt-10 space-y-6 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Adresse
              </dt>
              <dd className="mt-1 font-medium text-ink">
                {company.address.full}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Téléphone
              </dt>
              <dd className="mt-1 font-medium text-ink">
                {companyTelHref() ? (
                  <a className="hover:text-signal" href={companyTelHref()!}>
                    {company.phone}
                  </a>
                ) : (
                  company.phone
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                E-mail
              </dt>
              <dd className="mt-1 font-medium text-ink">
                <a
                  className="hover:text-signal"
                  href={`mailto:${company.email}`}
                >
                  {company.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Horaires
              </dt>
              <dd className="mt-1 font-medium text-ink">{company.hours}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-card/70 p-6 sm:p-8">
          <Suspense
            fallback={
              <p className="text-sm text-muted-foreground">
                Chargement du formulaire…
              </p>
            }
          >
            <ContactForm />
          </Suspense>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#d0d9e6]">
        <iframe
          title={`Carte — ${company.address.full}`}
          className="h-[280px] w-full sm:h-[360px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(company.address.full)}&z=15&output=embed`}
        />
      </div>
    </div>
  );
}
