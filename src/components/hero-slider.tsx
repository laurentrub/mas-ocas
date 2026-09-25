"use client";

import Image from "next/image";
import {
  ClipboardCheck,
  RefreshCcw,
  ShieldCheck,
  Tags,
} from "lucide-react";
import {
  useEffect,
  useState,
  type ComponentType,
} from "react";

type Stat = {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
};

type HeroVehicle = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Position classes for the absolute wrapper */
  wrapClassName: string;
  /** Soft contact shadows under the cutout */
  shadows: readonly string[];
  maskClassName: string;
  sizes: string;
};

type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  /** "side-by-side" = utilitaires côte à côte ; "overlap" = cutouts Distinxion */
  layout: "side-by-side" | "overlap";
  vehicles: readonly HeroVehicle[];
};

const stats: readonly Stat[] = [
  { icon: ClipboardCheck, label: "Véhicules contrôlés" },
  { icon: Tags, label: "Multi-marques" },
  { icon: ShieldCheck, label: "Garantie incluse" },
  { icon: RefreshCcw, label: "Reprise possible" },
];

const slides: readonly HeroSlide[] = [
  {
    id: "utilitaires",
    title: "Trouvez l’utilitaire qui vous ressemble",
    subtitle: "Fourgons & véhicules pros",
    layout: "side-by-side",
    vehicles: [
      {
        src: "/hero/util-pair-v5.png",
        alt: "Utilitaires d’occasion — fourgon et plateau",
        width: 1345,
        height: 498,
        wrapClassName: "relative w-full origin-bottom",
        shadows: [],
        maskClassName: "",
        sizes: "(max-width: 1024px) 90vw, 520px",
      },
    ],
  },
  {
    id: "voitures",
    title: "Trouvez la voiture qui vous ressemble",
    subtitle: "Garage multi-marques",
    layout: "overlap",
    vehicles: [
      {
        src: "/hero/car-back.png",
        alt: "",
        width: 900,
        height: 600,
        wrapClassName:
          "absolute right-[-2%] top-0 z-[1] w-[58%] sm:w-[54%]",
        shadows: [
          "absolute bottom-[3%] left-[10%] h-[15%] w-[30%] rounded-full bg-black/5 blur-xl",
        ],
        maskClassName:
          "[mask-image:linear-gradient(to_bottom,black_88%,transparent_98%)]",
        sizes: "(max-width: 1024px) 40vw, 280px",
      },
      {
        src: "/hero/car-front.png",
        alt: "Véhicules d’occasion — citadine et SUV",
        width: 900,
        height: 600,
        wrapClassName:
          "absolute bottom-0 left-[-4%] z-[2] w-[74%] sm:left-[-2%] sm:w-[70%]",
        shadows: [
          "absolute bottom-[2%] left-[10%] h-[15%] w-[30%] rounded-full bg-black/5 blur-xl",
          "absolute bottom-[3%] left-[20%] h-[10%] w-[20%] rounded-full bg-black/10 blur-lg",
        ],
        maskClassName:
          "[mask-image:linear-gradient(to_bottom,black_86%,transparent_96%)]",
        sizes: "(max-width: 1024px) 55vw, 360px",
      },
    ],
  },
];

const AUTO_MS = 6500;

/**
 * Hero slider — utilitaires (priorité) puis voitures, cutouts Distinxion-style.
 */
export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const slide = slides[index] ?? slides[0];

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [index]);

  return (
    <div className="relative">
      <div className="mx-auto grid max-w-[1200px] items-center gap-4 px-4 py-3 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8 lg:px-8">
        <div className="relative z-10 text-center lg:text-left">
          <h1 className="font-display text-[1.75rem] font-extrabold uppercase leading-[1.05] tracking-tight text-navy sm:text-4xl lg:text-[2.65rem]">
            {slide.title}
          </h1>
          <p className="mt-2.5 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-orange sm:text-sm">
            {slide.subtitle}
          </p>
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2 lg:mt-6 lg:max-w-md">
            {stats.map((stat) => (
              <li
                key={stat.label}
                className="flex flex-col items-center gap-1.5 text-center"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-white/85 text-orange shadow-[0_4px_14px_rgb(12_35_64/0.08)]">
                  <stat.icon className="size-4" aria-hidden />
                </span>
                <span className="text-[10px] font-semibold leading-snug text-navy sm:text-[11px]">
                  {stat.label}
                </span>
              </li>
            ))}
          </ul>

          <div
            className="mt-5 flex items-center justify-center gap-2 lg:justify-start"
            role="tablist"
            aria-label="Slides du hero"
          >
            {slides.map((item, i) => {
              const active = i === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={item.subtitle}
                  onClick={() => setIndex(i)}
                  className={
                    active
                      ? "h-2 w-6 rounded-full bg-orange transition-all"
                      : "h-2 w-2 rounded-full bg-navy/25 transition-all hover:bg-navy/40"
                  }
                />
              );
            })}
          </div>
        </div>

        <div className="relative w-full min-w-0 pr-2 sm:pr-4">
          <div className="relative mx-auto aspect-[16/9] max-h-[240px] w-full max-w-md sm:max-h-[280px] lg:ml-auto lg:max-h-[320px] lg:max-w-none">
            {slides.map((item, slideIndex) => {
              const visible = slideIndex === index;
              const isPriority = slideIndex === 0;

              return (
                <div
                  key={item.id}
                  className={
                    visible
                      ? item.layout === "side-by-side"
                        ? "absolute inset-0 flex items-end justify-center gap-0 opacity-100 transition-opacity duration-500"
                        : "absolute inset-0 opacity-100 transition-opacity duration-500"
                      : item.layout === "side-by-side"
                        ? "pointer-events-none absolute inset-0 flex items-end justify-center gap-0 opacity-0 transition-opacity duration-500"
                        : "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
                  }
                  aria-hidden={!visible}
                >
                  {item.vehicles.map((vehicle) => (
                    <div key={vehicle.src} className={vehicle.wrapClassName}>
                      {vehicle.shadows.map((shadowClass) => (
                        <div
                          key={shadowClass}
                          aria-hidden
                          className={shadowClass}
                        />
                      ))}
                      <Image
                        src={vehicle.src}
                        alt={vehicle.alt}
                        width={vehicle.width}
                        height={vehicle.height}
                        priority={isPriority}
                        unoptimized
                        className={`pointer-events-none h-auto w-full select-none object-contain ${vehicle.maskClassName}`}
                        sizes={vehicle.sizes}
                      />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
