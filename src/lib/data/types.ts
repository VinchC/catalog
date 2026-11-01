// Types communs aux deux catalogues.

export type Genre = {
  id: string;
  name: string;
};

// Catalogue musical.

export type MusicalArtist = {
  id: string;
  name: string;
  country: string;
  startYear: number;
  endYear?: number;
};

export type MusicalWork = {
  id: string;
  title: string;
  artistId: string;
  year: number;
  genreIds: string[];
};

export type MusicCatalog = {
  artists: MusicalArtist[];
  works: MusicalWork[];
  genres: Genre[];
};

// Catalogue cinéma.

export type MovieDirector = {
  id: string;
  name: string;
  country: string;
  birthYear: number;
  deathYear?: number;
};

export type Movie = {
  id: string;
  title: string;
  directorId: string;
  year: number;
  genreIds: string[];
};

export type CinemaCatalog = {
  directors: MovieDirector[];
  movies: Movie[];
  genres: Genre[];
};

// Structure générale du fichier JSON.

export type CatalogData = {
  music: MusicCatalog;
  cinema: CinemaCatalog;
};