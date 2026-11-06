# Aide-mémoire — Projet Catalog

Commandes courantes pour développer, tester et administrer l'application.

## 1. Lancer et vérifier l'application

### Installer les dépendances

npm ci

### Démarrer PostgreSQL local

À la racine du projet, dans Git Bash :

docker compose up -d
docker compose ps

### Démarrer Next.js

npm run dev

Application : http://localhost:3000

### Arrêter Next.js

`Ctrl + C` dans le terminal qui exécute le serveur.

### Vérifications du code

npm run validate:data
npm run lint
npm run test
npm run test:integration
npx playwright test
npx tsc --noEmit
npm run build
git status

- `validate:data` : vérification des données du catalogue.
- `lint` : détection des problèmes de qualité du code.
- `test` : tests unitaires Vitest.
- `test:integration` : tests d'intégration PostgreSQL.
- `playwright test` : tests E2E.
- `tsc` : vérification des types TypeScript.
- `build` : vérification et compilation de l'application pour la production.

### Validation des données JSON

npm run validate:data

---

## 2. Prisma — Gestion du schéma et de la base

### Vérifier le schéma Prisma

npx prisma validate

### Générer le client Prisma

npx prisma generate

À exécuter après une modification du schéma Prisma.

### Créer une migration en développement

npx prisma migrate dev --name nom_de_la_migration

Exemple :

npx prisma migrate dev --name add_users

### Consulter l'état des migrations

npx prisma migrate status

### Appliquer les migrations sur une base distante

npx prisma migrate deploy

À utiliser uniquement après avoir vérifié explicitement la base ciblée et les variables d'environnement. En production, cette commande est exécutée par le job GitHub Actions `Migrations de production`, après validation de la CI et avant le déploiement Vercel. Ne pas la lancer localement sur Production.

### Ouvrir Prisma Studio

npx prisma studio

Interface graphique pour consulter et modifier les données de la base. Vérifier la base ciblée avant toute modification.

### Exécuter le script de remplissage initial

npx prisma db seed

À utiliser lorsque le script de seed est configuré dans `prisma.config.ts`. Vérifier impérativement la base ciblée avant exécution.

---

## 3. Vérifications et tests

### Tests unitaires en mode surveillance

npm run test:watch

### Tous les tests unitaires une seule fois

npm run test

### Tests d'intégration PostgreSQL

npm run test:integration

### Tests E2E Playwright

npx playwright test

### Tests E2E avec interface Playwright

npx playwright test --ui

### Rapport HTML Playwright

npx playwright show-report

Les tests d'intégration utilisent `.env.test` et la base `catalog_test`. Vérifier que PostgreSQL est démarré avant de les lancer.

**Sécurité :** ne jamais remplacer `DATABASE_URL` de `.env.test` par l'URL de la base de développement, Preview ou Production. Le test d'intégration vérifie que l'URL cible contient bien `/catalog_test`.

---

## 4. PostgreSQL — Connexion et exploration

### Se connecter à la base locale depuis Git Bash

psql -h localhost -p 5433 -U catalog_user -d catalog

Le mot de passe est celui défini dans le fichier `.env`.

### Commandes générales dans `psql`

| Commande     | Fonction                                            |
| ------------ | --------------------------------------------------- |
| `\q`         | Quitter psql                                        |
| `\?`         | Aide sur les commandes psql                         |
| `\h`         | Aide sur les commandes SQL                          |
| `\conninfo`  | Informations sur la connexion                       |
| `\l`         | Liste des bases de données                          |
| `\c catalog` | Se connecter à la base catalog                      |
| `\dt`        | Lister les tables                                   |
| `\dt+`       | Lister les tables avec informations complémentaires |
| `\d "User"`  | Structure de la table User                          |
| `\d+ "User"` | Structure détaillée de la table User                |
| `\du`        | Liste des rôles PostgreSQL                          |

Attention : les noms de tables Prisma avec majuscules doivent être entourés de guillemets doubles.

### Afficher les données d'une table

sql
SELECT \* FROM "User";

### Compter les enregistrements

sql
SELECT COUNT(\*) FROM "User";

### Afficher uniquement certaines colonnes

sql
SELECT id, name, email, role
FROM "User";

### Afficher les tables du catalogue musical

sql
SELECT _ FROM "Artist";
SELECT _ FROM "MusicalWork";
SELECT \* FROM "MusicGenre";

### Afficher les films

sql
SELECT \* FROM "Movie";

### Afficher les colonnes d'une table

sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'User'
ORDER BY ordinal_position;

---

## 5. Docker — Gestion de PostgreSQL

Les commandes suivantes sont à exécuter dans Git Bash, à la racine du projet.

### Vérifier les conteneurs

docker compose ps

### Démarrer PostgreSQL

docker compose start db

### Arrêter PostgreSQL

docker compose stop db

### Redémarrer PostgreSQL

docker compose restart db

### Démarrer les services et créer les conteneurs si nécessaire

docker compose up -d

### Afficher les journaux PostgreSQL

docker compose logs db

Suivre les journaux en temps réel :

docker compose logs -f db

### Ouvrir directement psql dans le conteneur

docker compose exec db psql -U catalog_user -d catalog

### Vérifier que PostgreSQL répond

docker compose exec db pg_isready -U catalog_user -d catalog

### Arrêter les services

docker compose down

Cette commande supprime les conteneurs, mais conserve le volume de données.

**Attention : ne pas utiliser `docker compose down -v` sans décision explicite de réinitialiser la base.** L'option `-v` supprime également les volumes et donc les données PostgreSQL persistantes.

---

## 6. Git — Suivi du projet

### Vérifier la branche et les modifications

git status
git branch

### Afficher les différences

git diff

### Ajouter les fichiers modifiés

git add .

### Enregistrer les modifications

git commit -m "Description des modifications"

### Envoyer les modifications sur GitHub

Pour le développement courant :

git push origin dev

### Consulter l'historique

git log --oneline

---

## 7. Déploiement — GitHub Actions, Vercel et Neon

### Environnements

| Environnement       | Code           | Hébergement       | Base PostgreSQL                     |
| ------------------- | -------------- | ----------------- | ----------------------------------- |
| Développement local | Travail local  | Next.js local     | PostgreSQL Docker local (`catalog`) |
| Preview             | Branche `dev`  | Vercel Preview    | Neon, branche `preview`             |
| Production          | Branche `main` | Vercel Production | Neon, branche `production`          |

Les branches Neon `preview` et `production` sont distinctes. Les modifications de données effectuées en Preview ne modifient pas directement la base Production.

### Déploiement Preview

1. Développer sur la branche `dev`.
2. Vérifier les changements et lancer les tests localement si nécessaire.
3. Envoyer les modifications :

git push origin dev

4. GitHub Actions exécute les contrôles CI.
5. Vercel crée automatiquement un déploiement Preview pour `dev`.
6. Vérifier le déploiement et tester l'application sur son URL Preview.

Les variables Vercel `DATABASE_URL` et `AUTH_SECRET` de l'environnement Preview sont distinctes de celles de Production. `DATABASE_URL` pointe vers la branche Neon `preview`.

### Déploiement Production

1. Ouvrir une Pull Request de `dev` vers `main`.
2. Attendre la réussite de tous les contrôles GitHub Actions.
3. Fusionner la Pull Request.
4. Sur le push vers `main`, GitHub Actions exécute dans cet ordre :
   - `Tests et validation` ;
   - `Migrations de production` sur Neon Production ;
   - `Déploiement Vercel Production`.
5. Vérifier la réussite des trois jobs dans GitHub Actions.
6. Tester l'application sur l'URL Production.

Le déploiement Vercel déclenché directement par l'intégration Git est ignoré pour Production : le déploiement de Production est piloté par le job GitHub Actions dédié. Les déploiements Preview restent gérés par Vercel.

### Secrets et variables

Les secrets ne doivent jamais être inscrits dans le dépôt Git ni communiqués dans les logs.

- Vercel Production : `DATABASE_URL` (Neon Production) et `AUTH_SECRET`.
- Vercel Preview : `DATABASE_URL` (Neon Preview) et `AUTH_SECRET` distinct.
- GitHub Environment `production` : `DIRECT_URL` pour les migrations, ainsi que `VERCEL_TOKEN`, `VERCEL_ORG_ID` et `VERCEL_PROJECT_ID` pour le déploiement.
- Local : variables définies dans `.env`.
- Tests d'intégration : `DATABASE_URL` dans `.env.test`, pointant vers `catalog_test`.

Ne jamais utiliser une URL Production pour des tests ou manipulations Preview.

---

## 8. Rappels importants

- `.env` et `.env.test` contiennent des variables de configuration et des secrets locaux.
- Ne jamais publier `.env`, `.env.test`, un mot de passe, un secret Auth.js ou une URL de base de données contenant des identifiants.
- `DATABASE_URL` indique à l'application comment se connecter à PostgreSQL.
- `DIRECT_URL` est utilisée par le processus de migrations de production.
- `docker compose stop db` arrête PostgreSQL sans supprimer les données.
- `npx prisma migrate dev` crée et applique une migration en développement.
- `npx prisma migrate deploy` applique les migrations déjà versionnées sur la base ciblée.
- `npx prisma generate` régénère le client Prisma.
- `npx prisma studio` permet d'explorer les données graphiquement.
- Avant une modification importante du schéma, vérifier l'état des migrations et prévoir une sauvegarde.
- Toujours vérifier la branche Git et la base ciblée avant une opération susceptible de modifier des données.

## 9. Ordre de vérification habituel

Après une modification du code :

npx prisma validate
npx prisma generate
npx tsc --noEmit
npm run lint
npm run test
npm run test:integration
npx playwright test
npm run build

Les deux premières commandes sont particulièrement utiles après une modification du schéma Prisma. Pour une simple modification de composant ou de page, les contrôles TypeScript, lint, tests concernés et build suffisent généralement.
