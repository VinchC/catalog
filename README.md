# Catalog

Application web de gestion et de consultation d'un catalogue musical, développée avec Next.js, TypeScript, PostgreSQL et Prisma.

Ce projet d'apprentissage et de portfolio présente une application structurée avec authentification, gestion des rôles, opérations CRUD et tests automatisés. L'application est déployée avec un environnement Preview et un environnement Production distincts.

## Fonctionnalités

### Catalogue musical

- Consultation du catalogue musical.
- Consultation des fiches d'œuvres et d'artistes.
- Création et modification des œuvres musicales.
- Gestion des associations entre œuvres et genres.
- Création et modification des artistes.
- Suppression des artistes et des œuvres selon les droits attribués.

### Authentification et autorisations

- Authentification par identifiants avec Auth.js.
- Mots de passe hachés avec bcryptjs.
- Gestion des rôles `USER` et `ADMIN`.
- Accès aux opérations contrôlé côté serveur.
- Les utilisateurs authentifiés peuvent créer et modifier les artistes et les œuvres.
- La suppression est réservée aux administrateurs.
- Les pages protégées ne sont pas accessibles sans authentification.

## Architecture

Le projet utilise l'App Router de Next.js et sépare notamment les composants d'interface, les actions serveur, les accès aux données, les validations et les contrôles d'autorisation.

Le périmètre cinéma est conservé dans le code et le modèle de données, mais sa route publique est actuellement désactivée.

## Stack technique

- Framework : Next.js 16 (App Router)
- Interface : React 19, TypeScript, Tailwind CSS v4
- Base de données : PostgreSQL 17
- ORM : Prisma 7 avec adaptateur PostgreSQL
- Authentification : Auth.js v5 (Credentials)
- Hachage des mots de passe : bcryptjs
- Tests unitaires : Vitest
- Tests E2E : Playwright (Chromium)
- CI/CD : GitHub Actions
- Hébergement : Vercel
- PostgreSQL hébergé : Neon
- Environnement local : Docker Desktop

Consulter `package.json` pour les versions exactes installées.

## Prérequis

- Node.js et npm compatibles avec les versions indiquées dans le projet.
- Docker Desktop.
- Git.
- Un environnement PostgreSQL local (le projet utilise un conteneur Docker).

## Installation locale

1. Cloner le dépôt GitHub.
2. Installer les dépendances :

   npm ci

3. Configurer les variables d'environnement locales dans `.env`.
4. Démarrer PostgreSQL à la racine du projet :

   docker compose up -d

5. Générer le client Prisma :

   npx prisma generate

6. Appliquer les migrations de développement :

   npx prisma migrate dev

7. Démarrer Next.js :

   npm run dev

L'application est alors accessible à l'adresse http://localhost:3000.

## Variables d'environnement

Les fichiers `.env` et `.env.test` sont locaux et ne doivent pas être versionnés.

Ils contiennent notamment les paramètres de connexion PostgreSQL et les secrets nécessaires à l'authentification. Les noms exacts des variables doivent être vérifiés dans la configuration du projet (`prisma.config.ts`, configuration Auth.js et fichiers de tests).

- `.env` : environnement de développement local.
- `.env.test` : environnement de tests d'intégration, pointant vers la base `catalog_test`.

Ne jamais publier de mot de passe, de secret Auth.js ou d'URL de base de données contenant des identifiants.

## Tests et qualité

La CI GitHub Actions exécute les contrôles suivants :

- Validation des données du catalogue.
- Lint.
- Tests unitaires Vitest.
- Tests d'intégration PostgreSQL.
- Vérification TypeScript.
- Build Next.js.
- Tests E2E Playwright avec Chromium.

Commandes principales à lancer localement :

npm run validate:data
npm run lint
npm run test
npm run test:integration
npx tsc --noEmit
npm run build
npx playwright test

Les tests d'intégration utilisent une base PostgreSQL séparée, `catalog_test`. Il faut que le conteneur PostgreSQL soit démarré.

Pour les commandes détaillées, consulter [`COMMANDS.md`](./COMMANDS.md).

## Base de données et migrations

Le schéma Prisma est défini dans `prisma/schema.prisma`. Les migrations versionnées se trouvent dans `prisma/migrations/`.

En développement, créer une migration avec :

npx prisma migrate dev --name description_de_la_migration

Pour appliquer les migrations déjà versionnées :

npx prisma migrate deploy

En Production, cette dernière commande est exécutée automatiquement par le job GitHub Actions dédié, après la réussite des tests et avant le déploiement Vercel. Ne pas lancer manuellement une migration sur une base distante sans avoir vérifié explicitement l'environnement ciblé.

Ne jamais utiliser une commande de réinitialisation ou de suppression sur une base contenant des données à conserver.

## Déploiement et environnements

Le projet utilise trois environnements :

| Environnement       | Branche Git   | Hébergement       | Base de données            |
| ------------------- | ------------- | ----------------- | -------------------------- |
| Développement local | Travail local | Next.js local     | PostgreSQL Docker local    |
| Preview             | `dev`         | Vercel Preview    | Neon, branche `preview`    |
| Production          | `main`        | Vercel Production | Neon, branche `production` |

Les bases Neon Preview et Production sont séparées. Les opérations réalisées sur la base Preview n'affectent donc pas directement la base Production.

### Preview

Les modifications sont développées sur `dev` et envoyées sur GitHub. Vercel crée automatiquement un déploiement Preview pour cette branche. Cet environnement permet de vérifier l'application avant sa mise en production.

### Production

La mise en production suit le processus suivant :

1. Créer une Pull Request de `dev` vers `main`.
2. Attendre la réussite des contrôles CI.
3. Fusionner la Pull Request.
4. GitHub Actions relance les tests et validations sur `main`.
5. Le job `Migrations de production` applique les migrations sur Neon Production.
6. Le job `Déploiement Vercel Production` déploie l'application.

Le déploiement Git direct de Vercel est ignoré pour Production : le déploiement de Production est déclenché par GitHub Actions après les migrations. Les déploiements Preview restent gérés par Vercel.

Les secrets et variables de connexion sont configurés dans les environnements Vercel et GitHub correspondants. Ils ne doivent jamais être ajoutés au dépôt.

## État du projet

Le socle fonctionnel du catalogue musical est développé et déployé en Production.

Les vérifications de déploiement effectuées sur Preview ont confirmé le bon fonctionnement des opérations suivantes :

- Connexion avec un compte `USER` et un compte `ADMIN`.
- Déconnexion.
- Création et suppression d'une œuvre.
- Protection des pages privées lorsque l'utilisateur n'est pas connecté.
- Affichage des données du catalogue.

La CI, les migrations de Production et le déploiement Vercel Production ont également abouti.

## Organisation Git

- `dev` : branche de développement courant et source des déploiements Preview.
- `main` : branche destinée à la Production.

Le passage en Production se fait par Pull Request de `dev` vers `main`, après réussite des contrôles CI.

## Documentation complémentaire

- [`COMMANDS.md`](./COMMANDS.md) — commandes de développement, tests, Prisma, Docker, Git et déploiement.
- `prisma/schema.prisma` — modèle de données.
- `prisma/migrations/` — historique des migrations.
- `playwright.config.ts` — configuration des tests E2E.
- `vitest.config.mts` — configuration des tests unitaires.
- `vitest.integration.config.mts` — configuration des tests d'intégration.
