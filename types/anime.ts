// types/anime.ts

// --- Data untuk Card (Homepage) ---
export interface AnimeItem {
  title: string;
  slug: string; // ID unik untuk URL
  url: string;
  poster: string;
}

export interface ScheduleDay {
  day: string;
  anime_list: AnimeItem[];
}

export interface ScheduleResponse {
  status: string;
  creator: string;
  data: ScheduleDay[];
}

// --- Data untuk Detail Anime ---

export interface Genre {
  title: string;
  genreId: string;
  href: string;
  otakudesuUrl: string; // <--- UPDATE: Tambahan baru
}

export interface Episode {
  title: string;
  eps: number;
  date: string;
  episodeId: string;
  href: string;
  otakudesuUrl: string; // <--- UPDATE: Tambahan baru
}

export interface RecommendedAnime {
  title: string;
  poster: string;
  animeId: string;
  href: string;
  otakudesuUrl: string; // <--- UPDATE: Tambahan baru
}

export interface AnimeDetailData {
  title: string;
  poster: string;
  japanese: string;
  score: string;
  producers: string; // <--- UPDATE: Tambahan baru
  type: string;
  status: string;
  episodes: number;
  duration: string;
  aired: string;
  studios: string;
  batch: string | null; // <--- UPDATE: Tambahan baru (bisa string atau null)
  synopsis: {
    paragraphs: string[];
    connections: any[];
  };
  genreList: Genre[];
  episodeList: Episode[];
  recommendedAnimeList: RecommendedAnime[];
}

export interface AnimeDetailResponse {
  status: string;
  statusCode: number;
  statusMessage: string; // <--- TAMBAHKAN INI (Solusi Error)
  creator: string;
  message?: string;
  ok?: boolean;
  data: AnimeDetailData;
  pagination: any;
}
