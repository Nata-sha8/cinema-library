export interface Film {
  id: number;
  title: string;
  originalTitle: string;        
  language: string;
  releaseYear: number;
  releaseDate: string;
  genres: string[];             
  plot: string;
  runtime: number;              
  budget: string | null;
  revenue: number | null;
  homepage: string;
  status: string;
  posterUrl: string | null;           
  backdropUrl: string | null;        
  trailerUrl: string;
  trailerYouTubeId: string;
  tmdbRating: number;           
  searchL: string;
  keywords: string[];
  countriesOfOrigin: string[];
  languages: string[];
  cast: string[];
  director: string | null;
  production: string | null;
  awardsSummary: string | null;
  isFavorite?: boolean;       
}