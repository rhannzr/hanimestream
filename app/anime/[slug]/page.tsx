// app/anime/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getAnimeDetail } from "@/lib/api";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function AnimeDetailPage({ params }: Props) {
  const { slug } = await params;

  // Fetch real data
  const response = await getAnimeDetail(slug);
  const anime = response.data;

  return (
    <div className="min-h-screen pb-20 bg-slate-950">
      <div className="relative w-full min-h-[60vh] md:h-[60vh] flex items-end md:items-center overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <Image
            src={anime.poster}
            alt={anime.title}
            fill
            className="object-cover blur-xl opacity-40 scale-110"
            priority
          />
          <div className="absolute inset-0 bg-slate-900/60" />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/40 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full p-6 pt-24 md:pt-28 md:pb-12 md:px-12 flex flex-col md:flex-row gap-8 items-center md:items-end max-w-7xl mx-auto">
          {/* Poster Utama */}
          <div className="relative w-48 md:w-64 aspect-3/4 rounded-xl overflow-hidden shadow-2xl border-4 border-slate-800 shrink-0 mx-auto md:mx-0">
            <Image
              src={anime.poster}
              alt={anime.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Info Text */}
          <div className="flex-1 text-center md:text-left text-white mb-4">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-2 drop-shadow-lg">
              {anime.title}
            </h1>
            <p className="text-slate-200 text-lg italic mb-4 drop-shadow-md">
              {anime.japanese}
            </p>

            {/* Metadata Badges */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-semibold border border-cyan-500/30 backdrop-blur-sm">
                ⭐ {anime.score}
              </span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold border border-green-500/30 backdrop-blur-sm">
                {anime.status}
              </span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold border border-purple-500/30 backdrop-blur-sm">
                {anime.type}
              </span>
              <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm border border-slate-600 backdrop-blur-sm">
                {anime.aired}
              </span>
            </div>

            {/* Genre */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {anime.genreList.map((g) => (
                <span
                  key={g.genreId}
                  className="px-2 py-1 rounded-md text-xs bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white hover:border-cyan-500 cursor-pointer transition-colors"
                >
                  #{g.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Kolom Kiri: Sinopsis & Detail */}
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">
              Sinopsis
            </h2>
            <div className="text-slate-300 space-y-3 leading-relaxed text-sm text-justify">
              {anime.synopsis.paragraphs.length > 0 ? (
                anime.synopsis.paragraphs.map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <p className="italic text-slate-500">
                  Sinopsis tidak tersedia.
                </p>
              )}
            </div>
          </section>

          <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">
              Info Lengkap
            </h2>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex justify-between border-b border-slate-700/30 pb-2">
                <span>Studio:</span>{" "}
                <span className="text-white font-medium">{anime.studios}</span>
              </li>
              <li className="flex justify-between border-b border-slate-700/30 pb-2">
                <span>Durasi:</span>{" "}
                <span className="text-white font-medium">{anime.duration}</span>
              </li>
              <li className="flex justify-between">
                <span>Total Eps:</span>{" "}
                <span className="text-white font-medium">{anime.episodes}</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Daftar Episode (GRID) */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-1 h-8 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"></span>
            Daftar Episode
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {anime.episodeList.map((eps) => (
              <Link
                href={`/watch/${eps.episodeId}`}
                key={eps.episodeId}
                className="group relative bg-slate-800/50 hover:bg-slate-700 p-4 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between h-28 hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="text-xs text-slate-500 font-mono mb-1 bg-slate-900/50 w-fit px-2 py-0.5 rounded">
                  {eps.date}
                </span>
                <span className="font-bold text-white text-lg group-hover:text-cyan-400 line-clamp-1">
                  Ep {eps.eps}
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-400 group-hover:text-white transition-colors">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                    ▶
                  </span>
                  <span>Tonton</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* --- MASCOT  --- */}
      <div className="fixed bottom-0 right-0 z-50 pointer-events-none">
        <img
          src="/nempel.png"
          alt="Mascot HanimeStream"
          className="h-24 md:h-[40vh] w-auto object-contain object-bottom opacity-100 transition-all hover:scale-105"
        />
      </div>
    </div>
  );
}
