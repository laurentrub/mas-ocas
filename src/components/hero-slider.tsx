import Image from "next/image";
import {
  ClipboardCheck,
  RefreshCcw,
  ShieldCheck,
  Tags,
} from "lucide-react";
import type { ComponentType } from "react";

type Stat = {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>
  label: string
};

const title = "Trouvez la voiture qui vous ressemble";
const subtitle = "Garage multi-marques";
const alt = "Véhicules d’occasion — citadine et SUV";

const stats: readonly Stat[] = [
  { icon: ClipboardCheck, label: "Véhicules contrôlés" },
  { icon: Tags, label: "Multi-marques" },
  { icon: ShieldCheck, label: "Garantie incluse" },
  { icon: RefreshCcw, label: "Reprise possible" },
];

/**
 * Hero voitures — Distinxion-style overlapping cutouts.
 */
export function HeroSlider() {
  return (
    <div className="relative">
      <div className="mx-auto grid max-w-[1200px] items-center gap-4 px-4 py-3 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8 lg:px-8">
        <div className="relative z-10 text-center lg:text-left">
          <h1 className="font-display text-[1.75rem] font-extrabold uppercase leading-[1.05] tracking-tight text-navy sm:text-4xl lg:text-[2.65rem]">
            {title}
          </h1>
          <p className="mt-2.5 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-orange sm:text-sm">
            {subtitle}
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
        </div>

        <div className="relative w-full min-w-0 pr-2 sm:pr-4">
          <div className="relative mx-auto aspect-[16/9] max-h-[240px] w-full max-w-md sm:max-h-[280px] lg:ml-auto lg:max-h-[320px] lg:max-w-none">
            <div className="absolute right-[-2%] top-0 z-[1] w-[58%] sm:w-[54%]">
              <Image
                src="/hero/car-back.png"
                alt=""
                width={900}
                height={600}
                priority
                unoptimized
                className="pointer-events-none h-auto w-full select-none object-contain [filter:drop-shadow(0_14px_28px_rgba(10,37,64,0.24))]"
                sizes="(max-width: 1024px) 40vw, 280px"
              />
            </div>
            <div className="absolute bottom-0 left-[-4%] z-[2] w-[74%] sm:left-[-2%] sm:w-[70%]">
              <Image
                src="/hero/car-front.png"
                alt={alt}
                width={900}
                height={600}
                priority
                unoptimized
                className="pointer-events-none h-auto w-full select-none object-contain [filter:drop-shadow(0_18px_32px_rgba(10,37,64,0.28))]"
                sizes="(max-width: 1024px) 55vw, 360px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
