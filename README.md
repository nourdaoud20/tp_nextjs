This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Tableau de bord & Règles par rôle (TP3)

### Installation et lancement
1. `npm install`
2. Configurer `.env` (`DATABASE_URL="file:./dev.db"` et `JWT_SECRET="..."`)
3. `npx prisma migrate dev`
4. `npm run dev`

### Règles d'accès sur `/dashboard`
- **ADMIN :** Vue globale (Total étudiants, nouveaux inscrits sur 30 jours, graphique de croissance, tableau des 5 derniers étudiants) et accès complet aux routes API CRUD.
- **ENSEIGNANT :** Accès aux indicateurs pédagogiques globaux (KPIs et liste des 5 derniers étudiants) en consultation, sans droit de création ni de suppression de comptes.
- **ETUDIANT :** Vue restreinte à ses propres informations personnelles uniquement (aucun accès aux KPIs globaux ni aux données des autres étudiants).
