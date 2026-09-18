import type { Vehicle } from "@/lib/vehicles";
import {
  formatMileage,
  formatPrice,
  vehicleDisplayName,
  vehiclePath,
} from "@/lib/vehicles";
import { company } from "@/lib/company";

export function buildVehicleJsonLd(vehicle: Vehicle) {
  const name = vehicleDisplayName(vehicle);
  const url = `https://${company.domain}${vehiclePath(vehicle.slug)}`;
  const availability =
    vehicle.status === "Réservé"
      ? "https://schema.org/LimitedAvailability"
      : "https://schema.org/InStock";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `https://${company.domain}/#organization`,
        name: company.brand,
        url: `https://${company.domain}`,
        telephone: company.phone,
        email: company.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: company.address.street,
          postalCode: company.address.postalCode,
          addressLocality: company.address.city,
          addressCountry: "FR",
        },
      },
      {
        "@type": "Vehicle",
        "@id": `${url}#vehicle`,
        name,
        brand: { "@type": "Brand", name: vehicle.brand },
        model: vehicle.model,
        vehicleModelDate: String(vehicle.year),
        mileageFromOdometer: {
          "@type": "QuantitativeValue",
          value: vehicle.mileage,
          unitCode: "KMT",
        },
        fuelType: vehicle.fuel,
        vehicleTransmission: vehicle.transmission,
        color: vehicle.color,
        numberOfDoors: vehicle.doors,
        seatingCapacity: vehicle.seats,
        image: vehicle.image,
        description: vehicle.description,
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "EUR",
          price: vehicle.price,
          availability,
          seller: { "@id": `https://${company.domain}/#organization` },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: `https://${company.domain}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Véhicules",
            item: `https://${company.domain}/stock`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: vehicle.brand,
            item: `https://${company.domain}/stock?q=${encodeURIComponent(vehicle.brand)}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: vehicle.model,
            item: url,
          },
        ],
      },
    ],
  };
}

export function vehicleFaqItems(vehicle: Vehicle) {
  const name = vehicleDisplayName(vehicle);
  return [
    {
      question: `Ce ${name} est-il toujours disponible ?`,
      answer: `Le statut affiché est « ${vehicle.status} ». Confirmez la disponibilité auprès de ${company.brand} par téléphone (${company.phone}) ou via le formulaire de contact — le stock évolue rapidement.`,
    },
    {
      question: "Puis-je essayer ce véhicule au Mans ?",
      answer: `Oui, sur rendez-vous au ${company.address.full}. Indiquez « ${name} » dans votre demande pour que nous préparions l’essai.`,
    },
    {
      question: "Proposez-vous un financement pour ce véhicule ?",
      answer:
        "Oui. Nous pouvons orienter vers une simulation avec nos partenaires de crédit auto. Aucun taux ni mensualité n’est affiché ici sans étude de dossier — demandez une simulation via le CTA Financement.",
    },
    {
      question: "Livrez-vous ce véhicule ?",
      answer:
        "Remise possible au garage du Mans, ou livraison à domicile / sur site selon votre secteur. Les tarifs sont communiqués sur devis avant validation.",
    },
    {
      question: "Quels documents prévoir pour l’achat ?",
      answer:
        "Pièce d’identité, justificatif de domicile, et selon le financement les pièces demandées par l’organisme. Consultez aussi notre guide d’achat pour les démarches et documents.",
    },
  ];
}

export function contactVehicleHref(
  vehicle: Vehicle,
  sujet?: "Financement" | "Livraison" | "Rappel"
) {
  const base = `/contact?vehicule=${encodeURIComponent(vehicleDisplayName(vehicle))}`;
  return sujet ? `${base}&sujet=${encodeURIComponent(sujet)}` : base;
}

export function vehicleSpecs(vehicle: Vehicle) {
  return [
    { label: "Année", value: String(vehicle.year) },
    { label: "Kilométrage", value: formatMileage(vehicle.mileage) },
    { label: "Énergie", value: vehicle.fuel },
    { label: "Boîte", value: vehicle.transmission },
    { label: "Puissance", value: vehicle.power },
    { label: "Couleur", value: vehicle.color },
    { label: "Portes", value: String(vehicle.doors) },
    { label: "Places", value: String(vehicle.seats) },
    { label: "Prix", value: formatPrice(vehicle.price) },
    { label: "Statut", value: vehicle.status },
  ];
}
