import { ChevronDown } from "lucide-react";

export type VehicleFaqItem = {
  question: string;
  answer: string;
};

type Props = {
  items: VehicleFaqItem[];
};

/** FAQ accessible en HTML natif (`details` / `summary`), sans JS. */
export function VehicleFaq({ items }: Props) {
  return (
    <ul className="divide-y divide-[#d0d9e6] border-y border-[#d0d9e6]">
      {items.map((item) => (
        <li key={item.question}>
          <details className="group">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 text-left marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="font-display text-base font-bold text-navy sm:text-lg">
                {item.question}
              </span>
              <ChevronDown
                className="mt-1 size-5 shrink-0 text-orange transition-transform duration-300 group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <p className="pb-5 pr-10 text-[15px] leading-relaxed text-[#5a6b80]">
              {item.answer}
            </p>
          </details>
        </li>
      ))}
    </ul>
  );
}
