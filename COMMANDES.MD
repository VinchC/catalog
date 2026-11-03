# Aide-mémoire — Projet Catalog

Commandes courantes pour développer, tester et administrer l'application.

## 1. Lancer et tester l'application

### Démarrer Next.js

npm run dev

Application : http://localhost:3000

### Arrêter Next.js

`Ctrl + C` dans le terminal qui exécute le serveur.

### Vérifications du code

npx tsc --noEmit
npm run lint
npm run build

- `tsc` : vérification des types TypeScript.
- `lint` : détection des problèmes de qualité du code.
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

### Créer une migration

npx prisma migrate dev --name nom_de_la_migration

Exemple :

npx prisma migrate dev --name add_users

### Consulter l'état des migrations

npx prisma migrate status

### Appliquer les migrations en environnement de production

npx prisma migrate deploy

### Ouvrir Prisma Studio

npx prisma studio

Interface graphique pour consulter et modifier les données de la base.

### Exécuter le script de remplissage initial

npx prisma db seed

À utiliser lorsque le script de seed est configuré dans `prisma.config.ts`.

---

## 3. PostgreSQL — Connexion et exploration

### Se connecter à la base depuis Git Bash

psql -h localhost -p 5433 -U catalog_user -d catalog

Le mot de passe est celui défini dans le fichier `.env`.

### Commandes générales dans psql

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

SELECT \* FROM "User";

### Compter les enregistrements

SELECT COUNT(\*) FROM "User";

### Afficher uniquement certaines colonnes

SELECT id, name, email, role
FROM "User";

### Afficher les tables du catalogue musical

SELECT _ FROM "Artist";
SELECT _ FROM "MusicalWork";
SELECT \* FROM "MusicGenre";

### Afficher les films

SELECT \* FROM "Movie";

### Afficher les colonnes d'une table

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'User'
ORDER BY ordinal_position;

### Quitter psql

\q

---

## 4. Docker — Gestion de PostgreSQL

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

## 5. Git — Suivi du projet

### Vérifier les modifications

git status

### Afficher les différences

git diff

### Ajouter les fichiers modifiés

git add .

### Enregistrer les modifications

git commit -m "Description des modifications"

### Consulter l'historique

git log --oneline

---

## 6. Rappels importants

- `.env` contient les variables de configuration et les secrets locaux.
- Ne jamais publier `.env` sur GitHub.
- `DATABASE_URL` indique à Prisma comment se connecter à PostgreSQL.
- `docker compose stop db` arrête PostgreSQL sans supprimer les données.
- `npx prisma migrate dev` crée et applique une migration en développement.
- `npx prisma generate` régénère le client Prisma.
- `npx prisma studio` permet d'explorer les données graphiquement.
- Avant une modification importante du schéma, vérifier l'état des migrations et prévoir une sauvegarde.

## 7. Ordre de vérification habituel

Après une modification du code :

npx prisma validate
npx prisma generate
npx tsc --noEmit
npm run lint
npm run build

Les deux premières commandes sont particulièrement utiles après une modification du schéma Prisma. Pour une simple modification de composant ou de page, les trois dernières suffisent généralement.
