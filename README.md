# Catalog

Application web de gestion et de consultation d'un catalogue musical, développée avec Next.js, TypeScript, PostgreSQL et Prisma.

Ce projet est un projet d'apprentissage et de portfolio. Il vise à présenter une application structurée, avec authentification, gestion des rôles, opérations CRUD et plusieurs niveaux de tests automatisés.

## Fonctionnalités

## Catalogue musical

- Consultation du catalogue musical.
- Consultation des fiches d'œuvres et d'artistes.
- Création et modification des œuvres musicales.
- Gestion des associations entre œuvres et genres.
- Création et modification des artistes.
- Suppression des artistes et des œuvres selon les droits attribués.

## Authentification et autorisations

- Authentification par identifiants avec Auth.js.
- Mots de passe hachés avec bcryptjs.
- Gestion des rôles USER et ADMIN.
- Accès aux opérations contrôlé côté serveur.
- Les utilisateurs authentifiés peuvent créer et modifier les artistes et les œuvres.
- La suppression est réservée aux administrateurs.

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
- Environnement local : Docker Desktop
  Consulter package.json pour les versions exactes installées.

## Prérequis

- Node.js et npm compatibles avec les versions indiquées dans le projet.
- Docker Desktop.
- Git.
- Un environnement PostgreSQL local (le projet utilise un conteneur Docker).

## Installation locale

1. Cloner le dépôt GitHub.
2. Installer les dépendances : npm install
3. Configurer les variables d'environnement locales dans .env.
4. Démarrer PostgreSQL : docker start catalog-db
   Si le conteneur n'existe pas encore, suivre la configuration Docker documentée dans le projet plutôt que de créer un conteneur avec des paramètres supposés.
5. Générer le client Prisma : npx prisma generate
6. Appliquer les migrations de développement : npx prisma migrate dev
7. Démarrer Next.js : npm run dev
   L'application est alors accessible à l'adresse http://localhost:3000.

## Variables d'environnement

Les fichiers .env et .env.test sont locaux et ne doivent pas être versionnés.

Ils contiennent notamment les paramètres de connexion PostgreSQL et les secrets nécessaires à l'authentification. Les noms exacts des variables doivent être vérifiés dans la configuration du projet (prisma.config.ts, configuration Auth.js et fichiers de tests).

- .env : environnement de développement.
- .env.test : environnement de tests d'intégration, pointant vers la base catalog_test.

Ne jamais publier de mot de passe, de secret Auth.js ou d'URL de base de données contenant des identifiants.

## Tests et qualité

Les cinq contrôles suivants passent actuellement :
npm run test
npm run test:integration
npx playwright test
npx tsc --noEmit
npm run build

## Détail :

Commande Rôle
npm run test Tests unitaires Vitest
npm run test:integration Tests d'intégration PostgreSQL
npx playwright test Tests E2E Playwright
npx tsc --noEmit Contrôle TypeScript
npm run build Build de production

Les tests d'intégration utilisent une base PostgreSQL séparée, catalog_test. Il faut que le conteneur PostgreSQL soit démarré.

Pour les commandes détaillées, consulter [`COMMANDS.md`](./COMMANDS.md).

## Base de données et migrations

Le schéma Prisma est défini dans prisma/schema.prisma. Les migrations versionnées se trouvent dans prisma/migrations/.

En développement, créer une migration avec :
npx prisma migrate dev --name description_de_la_migration
Pour déployer des migrations sur un environnement distant, utiliser le processus prévu pour la production et prisma migrate deploy après avoir configuré explicitement l'environnement cible.

Ne jamais utiliser une commande de réinitialisation ou de suppression sur une base contenant des données à conserver.

## État du projet

Le socle fonctionnel du catalogue musical est développé. Les tests unitaires, d'intégration, E2E, la vérification TypeScript et le build de production local ont été exécutés avec succès.

Le développement de nouvelles fonctionnalités est temporairement mis en pause afin de préparer le déploiement :

- automatisation des contrôles avec GitHub Actions ;
- configuration de l'environnement de production ;
- choix et configuration de l'hébergement de l'application et de PostgreSQL ;
- vérification de la sécurité et de la gestion des secrets ;
- déploiement de prévisualisation puis mise en production.

Le build local réussi ne signifie pas que l'application est déjà déployée ni que la configuration de production est terminée.

## Organisation Git

Le développement courant est réalisé sur la branche dev. La branche main est destinée à recevoir une version stabilisée selon le processus de fusion qui sera défini avant le déploiement.

## Documentation complémentaire

- [`COMMANDS.md`](./COMMANDS.md) --- commandes de développement, tests, Prisma, Docker et Git.
- prisma/schema.prisma --- modèle de données.
- prisma/migrations/ --- historique des migrations.
- playwright.config.ts --- configuration des tests E2E.
- vitest.config.mts --- configuration des tests unitaires.
- vitest.integration.config.mts --- configuration des tests d'intégration.
