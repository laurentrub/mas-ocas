import {
  BadgeCheck,
  Calculator,
  Car,
  ClipboardList,
  FileText,
  Globe,
  MapPinned,
  PackageOpen,
  Truck,
  Stamp,
  type LucideIcon,
} from "lucide-react";
import type { GuideIconId } from "@/lib/guide-achat";

export const guideIcons: Record<GuideIconId, LucideIcon> = {
  acheter: Car,
  importer: Globe,
  exporter: PackageOpen,
  europe: MapPinned,
  demarches: ClipboardList,
  documents: FileText,
  homologation: BadgeCheck,
  immatriculation: Stamp,
  livraison: Truck,
  financer: Calculator,
};
