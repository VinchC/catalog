-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicalWork" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "artistId" TEXT NOT NULL,

    CONSTRAINT "MusicalWork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicGenre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MusicGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicalWorkGenre" (
    "workId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "MusicalWorkGenre_pkey" PRIMARY KEY ("workId","genreId")
);

-- CreateTable
CREATE TABLE "MovieDirector" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "birthYear" INTEGER NOT NULL,
    "deathYear" INTEGER,

    CONSTRAINT "MovieDirector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "directorId" TEXT NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CinemaGenre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CinemaGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieGenre" (
    "movieId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "MovieGenre_pkey" PRIMARY KEY ("movieId","genreId")
);

-- CreateIndex
CREATE UNIQUE INDEX "MusicalWork_slug_key" ON "MusicalWork"("slug");

-- CreateIndex
CREATE INDEX "MusicalWork_artistId_idx" ON "MusicalWork"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "MusicGenre_name_key" ON "MusicGenre"("name");

-- CreateIndex
CREATE INDEX "MusicalWorkGenre_genreId_idx" ON "MusicalWorkGenre"("genreId");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_slug_key" ON "Movie"("slug");

-- CreateIndex
CREATE INDEX "Movie_directorId_idx" ON "Movie"("directorId");

-- CreateIndex
CREATE UNIQUE INDEX "CinemaGenre_name_key" ON "CinemaGenre"("name");

-- CreateIndex
CREATE INDEX "MovieGenre_genreId_idx" ON "MovieGenre"("genreId");

-- AddForeignKey
ALTER TABLE "MusicalWork" ADD CONSTRAINT "MusicalWork_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicalWorkGenre" ADD CONSTRAINT "MusicalWorkGenre_workId_fkey" FOREIGN KEY ("workId") REFERENCES "MusicalWork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicalWorkGenre" ADD CONSTRAINT "MusicalWorkGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "MusicGenre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "MovieDirector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieGenre" ADD CONSTRAINT "MovieGenre_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieGenre" ADD CONSTRAINT "MovieGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "CinemaGenre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
