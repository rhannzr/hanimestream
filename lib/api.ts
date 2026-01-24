// lib/api.ts
import { ScheduleResponse, AnimeDetailResponse } from "@/types/anime";

// ⚠️ GANTI INI DENGAN BASE URL API KAMU
const BASE_URL = "https://www.sankavollerei.com";

// Helper function biar gak nulis fetch berulang-ulang
async function fetchAPI(endpoint: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    next: { revalidate: 3600 }, // Cache data selama 1 jam (ISR)
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
  }

  return res.json();
}

// --- 1. HOME & SCHEDULE ---
export const getSchedule = async (): Promise<ScheduleResponse> => {
  return fetchAPI("/anime/schedule");
};

// --- 2. DETAIL ANIME ---
export const getAnimeDetail = async (
  slug: string,
): Promise<AnimeDetailResponse> => {
  return fetchAPI(`/anime/anime/${slug}`);
};

// --- 3. DETAIL EPISODE (STREAMING) ---
// Kita pakai 'any' dulu karena kita belum tau persis bentuk JSON episode-nya
export const getEpisodeDetail = async (slug: string): Promise<any> => {
  return fetchAPI(`/anime/episode/${slug}`);
};

// --- 4. SEARCH ---
export const searchAnime = async (keyword: string): Promise<any> => {
  return fetchAPI(`/anime/search/${keyword}`);
};

// --- 5. SERVER STREAM (Video Source) ---
export const getServerStream = async (serverId: string): Promise<any> => {
  return fetchAPI(`/anime/server/${serverId}`);
};

// --- 6. ONGOING ANIME (Buat Rekomendasi) ---
export const getOngoingAnime = async (page = 1): Promise<any> => {
  return fetchAPI(`/anime/ongoing-anime?page=${page}`);
};

// --- 7. DAFTAR SEMUA GENRE ---
export const getAllGenres = async (): Promise<any> => {
  return fetchAPI("/anime/genre");
};

// --- 8. ANIME BERDASARKAN GENRE ---
export const getAnimeByGenre = async (slug: string, page = 1): Promise<any> => {
  return fetchAPI(`/anime/genre/${slug}?page=${page}`);
};

// --- 9. COMPLETED ANIME (Anime Tamat) ---
export const getCompletedAnime = async (page = 1): Promise<any> => {
  return fetchAPI(`/anime/complete-anime?page=${page}`);
};

// --- 10. ALL ANIME (Untuk List A-Z) ---
export const getAllAnime = async (): Promise<any> => {
  return fetchAPI("/anime/unlimited");
};
