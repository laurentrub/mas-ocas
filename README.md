# MAS OCAS AUTO

Site vitrine d’un garage multi-marques de vente et livraison de véhicules d’occasion, basé au Mans.

## Branches

- **`main`** — production uniquement
- **`dev`** — développement local (branche de travail par défaut)

Travaillez toujours sur `dev` en local. Ne poussez vers `main` que pour une mise en production.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui

## Lancer en local

```bash
cd ~/Documents/mas-ocas
npm install
npm run dev
```

Ouvrir [http://127.0.0.1:43127](http://127.0.0.1:43127).

Le script `dev` utilise webpack + file polling (évite les erreurs `EMFILE: too many open files` fréquentes sur ce Mac avec Turbopack). Variante Turbopack : `npm run dev:turbo`.

## Pages

- `/` — accueil (hero marque + sections)
- `/stock` — liste du stock (données mock)
- `/stock/[slug]` — fiche véhicule
- `/guide-achat` — hub SEO Guide d’achat
- `/guide-achat/[slug]` — articles (achat, import, export, démarches, etc.)
- `/contact` — demande d’information
- `/mentions-legales` — infos légales (KBis)

## Entreprise

**MAS OCAS AUTO** — Mathieu Alain SINGER, entrepreneur individuel, 15 Rue du Spoutnik, 72000 Le Mans — 109 272 831 R.C.S. Le Mans.
