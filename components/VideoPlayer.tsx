// components/VideoPlayer.tsx
"use client";

import { useState } from "react";
import { getServerStream } from "@/lib/api";

interface ServerOption {
  title: string;
  serverId: string;
  href: string;
}

interface QualityOption {
  title: string;
  serverList: ServerOption[];
}

interface VideoPlayerProps {
  defaultUrl: string;
  serverQualities: QualityOption[];
}

export default function VideoPlayer({
  defaultUrl,
  serverQualities,
}: VideoPlayerProps) {
  const [currentUrl, setCurrentUrl] = useState(defaultUrl);
  const [activeServer, setActiveServer] = useState("Default");
  const [loading, setLoading] = useState(false);

  // Fungsi saat user klik server lain
  const handleServerChange = async (server: ServerOption, quality: string) => {
    setLoading(true);
    setActiveServer(`${server.title} (${quality})`);

    try {
      // Ambil URL baru dari API
      const res = await getServerStream(server.serverId);
      if (res.data && res.data.url) {
        setCurrentUrl(res.data.url);
      } else {
        alert("Gagal mendapatkan link stream server ini.");
      }
    } catch (error) {
      console.error(error);
      alert("Error mengambil stream server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* --- IFRAME PLAYER --- */}
      <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-700">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        )}
        <iframe
          src={currentUrl}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="no-referrer" // Penting biar tidak diblokir
        />
      </div>

      {/* --- SERVER LIST --- */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          📡 Pilih Server & Resolusi{" "}
          <span className="text-xs font-normal text-slate-400">
            (Sedang memutar: {activeServer})
          </span>
        </h3>

        <div className="space-y-4">
          {serverQualities.map((quality, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-slate-700 pb-3 last:border-0"
            >
              <span className="text-cyan-400 font-bold min-w-60px text-sm bg-slate-900 px-2 py-1 rounded text-center">
                {quality.title}
              </span>
              <div className="flex flex-wrap gap-2">
                {quality.serverList.map((server) => (
                  <button
                    key={server.serverId}
                    onClick={() => handleServerChange(server, quality.title)}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-700 hover:bg-cyan-600 text-slate-200 hover:text-white rounded transition-colors"
                  >
                    {server.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
