// app/watch/[slug]/page.tsx
import { getEpisodeDetail } from "@/lib/api";
import VideoPlayer from "@/components/VideoPlayer";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function WatchPage({ params }: Props) {
  const { slug } = await params;

  // Ambil data episode
  const response = await getEpisodeDetail(slug);
  const data = response.data; // Data JSON yang kamu kirim tadi ada di sini

  if (!data) {
    return (
      <div className="text-white text-center mt-20">
        Episode tidak ditemukan :(
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto pb-20">
      {/* Navigasi Back */}
      <Link
        href={`/anime/${data.animeId}`} // Balik ke detail anime
        className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
      >
        ← Kembali ke Detail Anime
      </Link>

      {/* Judul Episode */}
      <h1 className="text-xl md:text-2xl font-bold text-white mb-2 leading-snug">
        {data.title}
      </h1>
      <p className="text-slate-400 text-sm mb-6">Rilis: {data.releaseTime}</p>

      {/* PLAYER COMPONENT (Client Side) */}
      <VideoPlayer
        defaultUrl={data.defaultStreamingUrl}
        serverQualities={data.server.qualities}
        animeTitle={data.info?.title || data.title}
        episode={data.title}
      />

      {/* Navigasi Next/Prev */}
      <div className="flex justify-between mt-8">
        {data.hasPrevEpisode ? (
          <Link
            href={`/watch/${data.prevEpisode.episodeId}`}
            className="bg-slate-800 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            ← Episode Sebelumnya
          </Link>
        ) : (
          <div /> // Spacer kosong
        )}

        {data.hasNextEpisode && (
          <Link
            href={`/watch/${data.nextEpisode.episodeId}`}
            className="bg-slate-800 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Episode Selanjutnya →
          </Link>
        )}
      </div>

      {/* List Episode (Sidebar/Bottom) */}
      <div className="mt-12 bg-slate-900 rounded-xl p-6 border border-slate-800">
        <h3 className="text-lg font-bold text-white mb-4">Episode Lainnya</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {data.info.episodeList.map((eps: any) => (
            <Link
              key={eps.episodeId}
              href={`/watch/${eps.episodeId}`}
              className={`p-3 text-center rounded-lg border text-sm font-medium transition-all ${eps.episodeId === slug
                  ? "bg-cyan-500 border-cyan-400 text-white" // Episode yang sedang aktif
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-cyan-500/50"
                }`}
            >
              Ep {eps.eps}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
