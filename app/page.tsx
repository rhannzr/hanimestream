// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { PlayCircle, Calendar, Sparkles, BookOpen } from "lucide-react"; // Tambah BookOpen
import { getOngoingAnime } from "@/lib/api"; // Import API
import AnimeCard from "@/components/AnimeCard"; // Import Card

export default async function Home() {
  // 1. FETCH DATA REKOMENDASI (Ongoing)
  // Kita ambil halaman 1, lalu nanti kita tampilkan sebagian saja
  let recommendations = [];
  try {
    const res = await getOngoingAnime(1);
    recommendations = res.data?.animeList || [];
  } catch (error) {
    console.error("Gagal memuat rekomendasi:", error);
  }

  return (
    <div className="bg-slate-900 min-h-screen">
      {/* ================= HERO SECTION ================= */}
      <div className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-500px h-500px bg-cyan-500/20 rounded-full blur-120px -z-10 opacity-40" />
        <div className="absolute bottom-0 right-0 w-500px h-500px bg-purple-500/20 rounded-full blur-100px -z-10 opacity-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center z-10 py-10 lg:py-0">
          {/* --- KIRI: TEKS --- */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700 text-cyan-400 text-sm font-medium animate-fade-in backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>Halo Goy Selamat Datang di</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Hanime
              <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-600">
                Stream
              </span>
            </h1>

            <div className="space-y-4 max-w-lg">
              <p className="text-lg sm:text-xl text-slate-300 font-light leading-relaxed">
                Nonton anime gratis tanpa iklan sepuasnya, nikmati ribuan judul
                anime terbaru update setiap hari.
              </p>
              <div className="inline-block transform hover:scale-105 transition-transform duration-300">
                <p className="text-base sm:text-lg text-yellow-400/90 font-medium italic bg-yellow-400/10 px-4 py-2 rounded-lg border border-yellow-400/20">
                  "Tapi tolong! ingat waktu juga yh." 😅
                </p>
              </div>
            </div>

            {/* --- AREA TOMBOL --- */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 w-full pt-4">
              {/* Tombol 1: Jadwal */}
              <Link
                href="/jadwal"
                className="group flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_30px_rgba(8,145,178,0.6)] hover:-translate-y-1"
              >
                <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Cek Jadwal
              </Link>

              {/* Tombol 2: Genre */}
              <Link
                href="/genre"
                className="group flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-lg border border-slate-700 transition-all hover:-translate-y-1"
              >
                <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Eksplor Genre
              </Link>

              <Link
                href="/directory"
                className="group flex items-center justify-center gap-2 px-6 py-3 bg-transparent hover:bg-slate-800 text-cyan-400 hover:text-white rounded-xl font-bold text-lg border border-cyan-500/50 hover:border-cyan-500 transition-all hover:-translate-y-1"
              >
                <BookOpen className="w-5 h-5" />
                Daftar A-Z
              </Link>
            </div>
          </div>

          {/* --- KANAN: GAMBAR HERO --- */}
          <div className="relative h-350px sm:h-450px lg:h-600px w-full flex items-center justify-center order-1 lg:order-2 mt-8 lg:mt-0">
            <div className="relative w-full h-full">
              <img
                src="/hero-char.png"
                alt="Anime Character Hero"
                className="w-full h-full object-contain lg:object-right animate-float relative z-0"
              />

              {/* Masking Gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-3/4 lg:h-1/2 bg-linear-to-t from-slate-900 via-slate-900/90 to-transparent z-10" />
              <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-slate-900/30 to-transparent hidden lg:block z-10" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= REKOMENDASI SECTION ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
          <div className="w-1.5 h-8 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
          <div>
            <h2 className="text-2xl font-bold text-white">
              Rekomendasi Hari Ini
            </h2>
            <p className="text-slate-400 text-sm">
              Anime ongoing yang lagi hangat-hangatnya.
            </p>
          </div>
        </div>

        {/* Grid Anime */}
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recommendations.slice(0, 12).map((anime: any, index: number) => (
              <AnimeCard
                key={anime.animeId || anime.slug || index}
                anime={{
                  ...anime,
                  slug: anime.animeId,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500">
            Gagal memuat rekomendasi.
          </div>
        )}
      </div>
    </div>
  );
}
