import Link from "next/link";
import Image from "next/image";
import {
  BadgeCheck,
  Calculator,
  ClipboardCheck,
  FileText,
  Handshake,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Star,
  Truck,
  Wrench,
} from "lucide-react";
import { HeroSearch } from "@/components/hero-search";
import { HomeFaq } from "@/components/home-faq";
import { HomeNewsletter } from "@/components/home-newsletter";
import { company } from "@/lib/company";
import { homepageGuideTopics } from "@/lib/guide-achat";
import { guideIcons } from "@/lib/guide-icons";
import { formatMileage, formatPrice, vehicles } from "@/lib/vehicles";

const heroVisual = {
  src: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1600&q=80",
  alt: "Voiture d’occasion en circulation urbaine",
};

const whyUs = [
  {
    icon: ClipboardCheck,
    title: "Contrôlés",
    text: "Inspection avant mise en vente : mécanique, freinage, carrosserie et dossier.",
  },
  {
    icon: Wrench,
    title: "Préparation avant livraison",
    text: "Nettoyage, points de sécurité et documents prêts le jour de la remise des clés.",
  },
  {
    icon: ShieldCheck,
    title: "Garantie",
    text: "Garantie adaptée au véhicule, expliquée clairement avant signature.",
  },
  {
    icon: Handshake,
    title: "Accompagnement",
    text: "De la sélection au financement, un interlocuteur jusqu’à la livraison.",
  },
  {
    icon: FileText,
    title: "Transparence",
    text: "Kilométrage, entretien et historique présentés sans zone d’ombre.",
  },
] as const;

const steps = [
  {
    n: "01",
    title: "Choisissez",
    text: "Parcourez le stock ou décrivez votre besoin : budget, motorisation, délai.",
  },
  {
    n: "02",
    title: "Contactez-nous",
    text: "On confirme la dispo, organise l’essai et répond à vos questions.",
  },
  {
    n: "03",
    title: "Finalisez",
    text: "Dossier d’achat, reprise éventuelle et solution de financement si besoin.",
  },
  {
    n: "04",
    title: "Recevez votre véhicule",
    text: "Remise des clés au garage ou livraison où vous le souhaitez.",
  },
] as const;

const financePoints = [
  {
    icon: BadgeCheck,
    title: "Financement",
    text: "Solutions adaptées à l’usage quotidien, avec un interlocuteur local.",
  },
  {
    icon: FileText,
    title: "Crédit",
    text: "Montage de dossier avec nos partenaires, sans jargon inutile.",
  },
  {
    icon: Calculator,
    title: "Simulation",
    text: "Estimez une mensualité indicative avant de vous engager.",
  },
] as const;

const reviews = [
  {
    name: "Sophie L.",
    place: "Le Mans",
    rating: 5,
    text: "Clio trouvée rapidement, dossier clair et livraison à domicile sans stress. On recommande.",
  },
  {
    name: "Karim B.",
    place: "Allonnes",
    rating: 5,
    text: "Échange transparent sur l’entretien du 3008. Prix affiché = prix payé, ça change.",
  },
  {
    name: "Nathalie R.",
    place: "La Flèche",
    rating: 4,
    text: "Bon accompagnement pour le financement. Véhicule propre, prêt le jour J.",
  },
] as const;

export default function HomePage() {
  const available = vehicles.filter((v) => v.status !== "Réservé").slice(0, 6);

  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-[#f4f6f9] pb-8 pt-10 sm:pb-10 sm:pt-14 lg:pb-12 lg:pt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-10 h-[420px] w-[420px] rounded-full bg-orange/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 bottom-0 h-[360px] w-[480px] rounded-[40%] bg-orange/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-[28%] top-1/3 h-40 w-72 rotate-12 rounded-[50%] bg-[#ffb070]/35 blur-2xl"
        />

        <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-8">
          <div className="relative mx-auto w-full max-w-xl animate-rise lg:max-w-none">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-[0_24px_55px_rgb(12_35_64/0.28)]">
              <Image
                src={heroVisual.src}
                alt={heroVisual.alt}
                fill
                priority
                className="object-cover animate-ken"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>
          </div>

          <div className="relative z-10 text-center lg:text-left">
            <p className="animate-rise font-display text-[11px] font-bold uppercase tracking-[0.22em] text-orange sm:text-xs">
              {company.brand}
            </p>
            <h1 className="animate-rise-delay-1 mt-3 font-display text-[2rem] font-extrabold uppercase leading-[1.05] tracking-tight text-navy sm:text-5xl lg:text-[3.1rem]">
              Trouvez la voiture qui vous ressemble
            </h1>
            <p className="animate-rise-delay-2 mt-4 font-display text-sm font-extrabold uppercase tracking-[0.14em] text-orange sm:text-base">
              Occasions multi-marques · Le Mans
            </p>
            <p className="animate-rise-delay-2 mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-[#5a6b80] lg:mx-0">
              Véhicules contrôlés, dossier transparent, livraison possible. Cherchez
              votre prochaine voiture ou contactez-nous directement.
            </p>
            <div className="animate-rise-delay-3 mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link
                href="/stock"
                className="inline-flex h-12 items-center rounded-lg bg-orange px-6 text-sm font-bold text-white transition-colors hover:bg-[#e05f00]"
              >
                Voir les véhicules
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center rounded-lg border border-navy/20 bg-white px-6 text-sm font-bold text-navy transition-colors hover:border-orange hover:text-orange"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>

        <div className="relative z-20 mt-10 sm:mt-12 lg:-mb-10 lg:mt-14">
          <HeroSearch />
        </div>
      </section>

      {/* 2. Véhicules disponibles */}
      <section
        id="vehicules"
        className="scroll-mt-28 border-b border-[#dce3ee] bg-white pb-16 pt-20 sm:pt-24 lg:pb-20 lg:pt-28"
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
                En vente
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
                Véhicules disponibles
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#5a6b80]">
                Sélection actuelle au garage — prix affichés, infos claires.
              </p>
            </div>
            <Link
              href="/stock"
              className="inline-flex h-10 items-center self-start rounded-md border border-[#c5d0de] px-4 text-sm font-semibold text-navy transition-colors hover:border-orange hover:text-orange sm:self-auto"
            >
              Voir tous
            </Link>
          </div>

          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {available.map((vehicle) => (
              <li key={vehicle.slug}>
                <article className="group">
                  <Link
                    href={`/stock/${vehicle.slug}`}
                    className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-navy">
                      <Image
                        src={vehicle.image}
                        alt={vehicle.imageAlt}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="font-display text-xl font-bold text-navy group-hover:text-orange">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm text-[#5a6b80]">
                        <div>
                          <dt className="sr-only">Année</dt>
                          <dd>Année · {vehicle.year}</dd>
                        </div>
                        <div>
                          <dt className="sr-only">Kilométrage</dt>
                          <dd>{formatMileage(vehicle.mileage)}</dd>
                        </div>
                        <div className="col-span-2">
                          <dt className="sr-only">Motorisation</dt>
                          <dd>
                            {vehicle.fuel} · {vehicle.transmission} · {vehicle.power}
                          </dd>
                        </div>
                      </dl>
                      <p className="mt-3 font-display text-lg font-extrabold text-navy">
                        {formatPrice(vehicle.price)}
                      </p>
                    </div>
                  </Link>
                  <Link
                    href={`/stock/${vehicle.slug}`}
                    className="mt-4 inline-flex h-10 items-center rounded-md bg-navy px-4 text-sm font-semibold text-white transition-colors hover:bg-orange"
                  >
                    Voir le véhicule
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Pourquoi nous ? */}
      <section
        id="pourquoi-nous"
        className="scroll-mt-28 bg-[#f4f6f9] py-16 lg:py-20"
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
              Engagements
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              Pourquoi nous ?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#5a6b80]">
              Un garage d’occasion au Mans, centré sur la clarté et la remise en
              main propre — pas sur le spectacle.
            </p>
          </div>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {whyUs.map((item) => (
              <li key={item.title} className="border-t-[3px] border-orange pt-5">
                <item.icon className="size-6 text-orange" aria-hidden />
                <h3 className="mt-4 font-display text-lg font-bold text-navy">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5a6b80]">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Comment ça marche ? */}
      <section
        id="comment-ca-marche"
        className="scroll-mt-28 border-y border-[#dce3ee] bg-white py-16 lg:py-20"
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
              Parcours
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              Comment ça marche ?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#5a6b80]">
              Quatre étapes simples, de la recherche à la réception du véhicule.
            </p>
          </div>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <li key={step.n} className="relative">
                <span className="font-display text-4xl font-extrabold text-orange/25">
                  {step.n}
                </span>
                <h3 className="mt-2 font-display text-xl font-bold text-navy">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5a6b80]">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Financement */}
      <section id="financement" className="scroll-mt-28 bg-navy py-16 text-white lg:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
              Budget
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Votre véhicule, avec une solution de financement adaptée.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/75">
              Financement, crédit ou simple simulation : on clarifie les options
              avant que vous ne vous engagiez.
            </p>
          </div>
          <ul className="mt-12 grid gap-8 sm:grid-cols-3">
            {financePoints.map((item) => (
              <li key={item.title} className="border-l-[3px] border-orange pl-5">
                <item.icon className="size-6 text-orange" aria-hidden />
                <h3 className="mt-4 font-display text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
          <Link
            href="/contact?sujet=Financement"
            className="mt-10 inline-flex h-12 items-center rounded-lg bg-orange px-6 text-sm font-bold text-white transition-colors hover:bg-[#e05f00]"
          >
            Faire une simulation
          </Link>
        </div>
      </section>

      {/* 6. Livraison */}
      <section id="livraison" className="scroll-mt-28 bg-[#f4f6f9] py-16 lg:py-20">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
              Remise des clés
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              Nous livrons votre véhicule où vous le souhaitez.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#5a6b80]">
              Remise au garage du Mans, livraison à domicile ou sur votre lieu de
              travail — selon vos contraintes.
            </p>
            <ul className="mt-8 space-y-4">
              <li className="flex gap-3 text-[15px] text-[#5a6b80]">
                <MapPin className="mt-0.5 size-5 shrink-0 text-orange" aria-hidden />
                <span>
                  <strong className="font-semibold text-navy">Zones :</strong> Le
                  Mans, Sarthe, Pays de la Loire — et au-delà sur étude.
                </span>
              </li>
              <li className="flex gap-3 text-[15px] text-[#5a6b80]">
                <Truck className="mt-0.5 size-5 shrink-0 text-orange" aria-hidden />
                <span>
                  <strong className="font-semibold text-navy">Modalités :</strong>{" "}
                  prise de rendez-vous, contrôle final, remise des papiers.
                </span>
              </li>
              <li className="flex gap-3 text-[15px] text-[#5a6b80]">
                <PackageCheck className="mt-0.5 size-5 shrink-0 text-orange" aria-hidden />
                <span>
                  <strong className="font-semibold text-navy">Tarifs :</strong> sur
                  devis, communiqués avant validation de la livraison.
                </span>
              </li>
            </ul>
            <Link
              href="/contact?sujet=Livraison"
              className="mt-8 inline-flex h-12 items-center rounded-lg border border-navy/20 bg-white px-6 text-sm font-bold text-navy transition-colors hover:border-orange hover:text-orange"
            >
              Demander un devis livraison
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-navy shadow-[0_20px_50px_rgb(12_35_64/0.18)]">
            <Image
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80"
              alt="Route — livraison véhicule"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 480px"
            />
          </div>
        </div>
      </section>

      {/* 7. Guide d’achat */}
      <section
        id="guide-achat"
        className="scroll-mt-28 border-y border-[#dce3ee] bg-white py-16 lg:py-20"
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
              Accompagnement
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              Guide d’achat
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#5a6b80]">
              Achat, import, export, documents, livraison et financement —
              les essentiels avant de vous engager, expliqués simplement.
            </p>
          </div>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {homepageGuideTopics.map((topic) => {
              const Icon = guideIcons[topic.icon];
              return (
                <li key={topic.slug} className="border-t-[3px] border-orange pt-5">
                  <Link
                    href={`/guide-achat/${topic.slug}`}
                    className="group block"
                  >
                    <Icon className="size-6 text-orange" aria-hidden />
                    <h3 className="mt-4 font-display text-lg font-bold text-navy group-hover:text-orange">
                      {topic.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#5a6b80]">
                      {topic.summary}
                    </p>
                    <span className="mt-3 inline-block text-sm font-bold text-orange">
                      Lire →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-10">
            <Link
              href="/guide-achat"
              className="inline-flex h-12 items-center rounded-lg bg-orange px-6 text-sm font-bold text-white transition-colors hover:bg-[#e05f00]"
            >
              Voir tout le guide d&apos;achat
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Avis clients */}
      <section id="avis" className="scroll-mt-28 bg-[#f4f6f9] py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
                Témoignages
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
                Avis clients
              </h2>
            </div>
            <div className="flex items-center gap-2 text-navy">
              <div className="flex" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-5 fill-orange text-orange"
                  />
                ))}
              </div>
              <p className="text-sm font-semibold">
                4,8 / 5 · avis clients (démo)
              </p>
            </div>
          </div>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {reviews.map((review) => (
              <li
                key={review.name}
                className="border-t-[3px] border-orange bg-white px-6 py-6 shadow-[0_8px_30px_rgb(12_35_64/0.06)]"
              >
                <div className="flex gap-0.5" aria-label={`${review.rating} sur 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < review.rating
                          ? "size-4 fill-orange text-orange"
                          : "size-4 text-[#d0d9e6]"
                      }
                    />
                  ))}
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-[#5a6b80]">
                  « {review.text} »
                </p>
                <p className="mt-5 font-display text-sm font-bold text-navy">
                  {review.name}
                  <span className="font-normal text-[#7a8a9c]">
                    {" "}
                    · {review.place}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 9. FAQ */}
      <section id="faq" className="scroll-mt-28 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
              Questions
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              FAQ
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-[#5a6b80]">
              Les réponses aux objections les plus fréquentes avant de nous
              contacter ou d’acheter.
            </p>
          </div>
          <div className="mt-10">
            <HomeFaq />
          </div>
          <p className="mt-8 text-center text-sm text-[#5a6b80]">
            Une autre question ?{" "}
            <Link href="/contact" className="font-semibold text-orange hover:underline">
              Écrivez-nous
            </Link>
          </p>
        </div>
      </section>

      {/* 10. Newsletter */}
      <section
        id="newsletter"
        className="scroll-mt-28 border-t border-[#dce3ee] bg-[#f4f6f9] py-16 lg:py-20"
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">
              Arrivages
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              Newsletter
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#5a6b80]">
              Recevez les nouveaux véhicules et arrivages {company.brand} — sans
              spam, juste l’essentiel.
            </p>
            <HomeNewsletter />
          </div>
        </div>
      </section>
    </>
  );
}
