import AnimeCard from "@/components/AnimeCard";
import { getSchedule } from "@/lib/api";

export default async function JadwalPage() {
  const schedule = await getSchedule();

  return (
    // Pastikan container utama adalah div, bukan p
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto relative">
      {/* HEADER */}
      {/* Pastikan tidak ada tag <p> yang membungkus div di dalam sini */}
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-cyan-400 mb-2">
          Jadwal Rilis Anime
        </h1>
        <div className="text-slate-400">
          Jangan sampai ketinggalan episode terbaru anime favoritmu!
        </div>
      </header>

      {/* LIST JADWAL */}
      <div className="space-y-12 pb-20">
        {schedule.data.map((dayItem, index) => (
          <section key={index}>
            {/* Judul Hari */}
            <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-2">
              <div className="w-2 h-8 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
              <h2 className="text-2xl font-bold text-slate-100">
                {dayItem.day}
              </h2>
            </div>

            {/* Grid Anime */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {dayItem.anime_list.map((anime) => (
                <AnimeCard key={anime.slug} anime={anime} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* --- FLOATING MASCOT (Wajib Ada) --- */}
      <div className="fixed bottom-0 right-0 z-50 pointer-events-none">
        <img
          src="/nempel.png"
          alt="Mascot HanimeStream"
          // PERUBAHAN DISINI:
          // 1. 'h-24' (96px) di mobile: Cukup kecil biar gak ganggu, tapi tetep kelihatan "ngintip".
          // 2. 'md:h-[40vh]': Di desktop balik lagi jadi gede biar puas lihat waifu-nya.
          className="h-24 md:h-[40vh] w-auto object-contain object-bottom opacity-100 transition-all hover:scale-105"
        />
      </div>
    </div>
  );
}
