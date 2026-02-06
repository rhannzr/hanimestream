// components/VideoPlayer.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
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
  animeTitle?: string;
  episode?: string;
}

// === SMART SERVER FILTERING CONFIG ===

// Server yang di-blacklist (penuh iklan)
const BLACKLISTED_SERVERS = ["vidhide", "filedon", "vid.hide", "file.don"];

// Server prioritas (aman, jarang iklan)
const PRIORITY_SERVERS = ["mega", "ondesu", "anicdn", "gdrive"];

/**
 * Check apakah server termasuk blacklist
 */
function isBlacklisted(serverName: string): boolean {
  const lowerName = serverName.toLowerCase();
  return BLACKLISTED_SERVERS.some((bl) => lowerName.includes(bl));
}

/**
 * Check apakah server termasuk prioritas
 */
function isPriority(serverName: string): boolean {
  const lowerName = serverName.toLowerCase();
  return PRIORITY_SERVERS.some((pr) => lowerName.includes(pr));
}

/**
 * Filter dan urutkan server list berdasarkan prioritas
 * - Prioritas: mega, ondesu (tampil duluan)
 * - Blacklist: vidhide, filedon (disembunyikan, kecuali jadi satu-satunya opsi)
 */
function filterServers(
  serverList: ServerOption[]
): { filtered: ServerOption[]; fallback: ServerOption | null } {
  const priorityServers: ServerOption[] = [];
  const normalServers: ServerOption[] = [];
  const blacklistedServers: ServerOption[] = [];

  // Kategorikan server
  for (const server of serverList) {
    if (isPriority(server.title)) {
      priorityServers.push(server);
    } else if (isBlacklisted(server.title)) {
      blacklistedServers.push(server);
    } else {
      normalServers.push(server);
    }
  }

  // Gabungkan: prioritas > normal
  const filtered = [...priorityServers, ...normalServers];

  // Jika tidak ada server safe, gunakan satu dari blacklist sebagai cadangan
  const fallback =
    filtered.length === 0 && blacklistedServers.length > 0
      ? blacklistedServers[0]
      : null;

  return { filtered, fallback };
}

// Helper: Clean Title
function cleanAnimeData(title: string, episode: string) {
  // Regex untuk menangkap "Episode X" dan membersihkannya dari judul
  // Contoh: "Dead Account Episode 4 Subtitle Indonesia" -> "Dead Account", Eps "4"
  const episodeRegex = /Episode\s+(\d+)/i;

  // Coba ambil nomor episode dari judul jika ada pattern "Episode X"
  const titleMatch = title.match(episodeRegex);
  const cleanEps = titleMatch ? titleMatch[1] : episode.replace(/Episode\s+/i, "");

  // Bersihkan judul: Hapus "Episode X", "Subtitle Indonesia", dan whitespace
  const cleanTitle = title
    .replace(episodeRegex, "")
    .replace(/Subtitle Indonesia/i, "")
    .replace(/Sub Indo/i, "")
    .trim();

  return { cleanTitle, cleanEps };
}

export default function VideoPlayer({
  defaultUrl,
  serverQualities,
  animeTitle = "Unknown",
  episode = "Unknown",
}: VideoPlayerProps) {
  const [currentUrl, setCurrentUrl] = useState(defaultUrl);
  const [activeServer, setActiveServer] = useState("Default");
  const [loading, setLoading] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  }>({
    message: "",
    type: "success",
    visible: false,
  });

  // Show Toast Helper
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, visible: true });
    // Auto hide after 3 seconds
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Apply Smart Filtering ke semua quality options
  const filteredQualities = useMemo(() => {
    return serverQualities.map((quality) => {
      const { filtered, fallback } = filterServers(quality.serverList);
      return {
        ...quality,
        filteredServers: filtered,
        fallbackServer: fallback,
      };
    });
  }, [serverQualities]);

  // Fungsi saat user klik server lain
  const handleServerChange = async (
    server: ServerOption,
    quality: string,
    isFallback: boolean = false
  ) => {
    setLoading(true);
    const serverLabel = isFallback
      ? `${server.title} (Cadangan) - ${quality}`
      : `${server.title} (${quality})`;
    setActiveServer(serverLabel);

    try {
      // Ambil URL baru dari API
      const res = await getServerStream(server.serverId);
      if (res.data && res.data.url) {
        setCurrentUrl(res.data.url);
      } else {
        showToast("Gagal mendapatkan link stream server ini.", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error mengambil stream server.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk lapor link mati
  const handleReport = async () => {
    if (isReporting) return;

    // 1. Anti-Spam Check (Client Side)
    if (typeof window !== "undefined") {
      const lastReport = localStorage.getItem("last_report_timestamp");
      if (lastReport) {
        const diff = Date.now() - parseInt(lastReport);
        const cooldown = 5 * 60 * 1000; // 5 menit

        if (diff < cooldown) {
          showToast(
            "Sabar goy, laporan kamu sudah masuk. Tunggu sebentar ya!",
            "error"
          );
          return;
        }
      }
    }

    setIsReporting(true);

    // 2. Data Cleaning
    const { cleanTitle, cleanEps } = cleanAnimeData(animeTitle, episode);

    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          animeTitle: cleanTitle,
          episode: cleanEps,
          serverName: activeServer,
          originalUrl: currentUrl,
        }),
      });

      const result = await response.json();

      if (result.success) {
        showToast("✅ Laporan berhasil dikirim, makasih goy!", "success");
        // Simpan timestamp sukses
        if (typeof window !== "undefined") {
          localStorage.setItem("last_report_timestamp", Date.now().toString());
        }
      } else {
        showToast("❌ Gagal mengirim laporan. Coba lagi nanti.", "error");
      }
    } catch (error) {
      console.error("Report error:", error);
      showToast("❌ Terjadi kesalahan saat mengirim laporan.", "error");
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* --- TOAST NOTIFICATION --- */}
      <div
        className={`fixed top-24 right-4 z-50 transition-all duration-300 transform ${toast.visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-4 opacity-0 pointer-events-none"
          }`}
      >
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-md ${toast.type === "success"
            ? "bg-green-500/10 border-green-500/20 text-green-400"
            : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
        >
          <span className="text-xl">
            {toast.type === "success" ? "🎉" : "⚠️"}
          </span>
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      </div>

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
          referrerPolicy="no-referrer"
        />
      </div>

      {/* --- SERVER LIST (Smart Filtered) --- */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            📡 Pilih Server & Resolusi{" "}
            <span className="text-xs font-normal text-slate-400">
              (Sedang memutar: {activeServer})
            </span>
          </h3>

          {/* Tombol Lapor Link Mati */}
          <button
            onClick={handleReport}
            disabled={isReporting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/30 hover:border-red-500/50"
          >
            {isReporting ? (
              <>
                <span className="animate-spin">⏳</span>
                Mengirim...
              </>
            ) : (
              <>
                ▶️ Kirim Laporan 🚀
              </>
            )}
          </button>
        </div>

        <div className="space-y-4">
          {filteredQualities.map((quality, idx) => {
            const hasServers =
              quality.filteredServers.length > 0 || quality.fallbackServer;

            if (!hasServers) return null;

            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-slate-700 pb-3 last:border-0"
              >
                <span className="text-cyan-400 font-bold min-w-[60px] text-sm bg-slate-900 px-2 py-1 rounded text-center">
                  {quality.title}
                </span>
                <div className="flex flex-wrap gap-2">
                  {/* Server Prioritas & Normal */}
                  {quality.filteredServers.map((server) => (
                    <button
                      key={server.serverId}
                      onClick={() =>
                        handleServerChange(server, quality.title, false)
                      }
                      className="px-3 py-1.5 text-xs font-medium bg-slate-700 hover:bg-cyan-600 text-slate-200 hover:text-white rounded transition-colors"
                    >
                      {isPriority(server.title) && "⭐ "}
                      {server.title}
                    </button>
                  ))}

                  {/* Server Cadangan (dari blacklist) */}
                  {quality.fallbackServer && (
                    <button
                      key={quality.fallbackServer.serverId}
                      onClick={() =>
                        handleServerChange(
                          quality.fallbackServer!,
                          quality.title,
                          true
                        )
                      }
                      className="px-3 py-1.5 text-xs font-medium bg-amber-700/50 hover:bg-amber-600 text-amber-200 hover:text-white rounded transition-colors border border-amber-600/30"
                      title="Server ini mungkin mengandung iklan"
                    >
                      ⚠️ {quality.fallbackServer.title} (Cadangan)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info tentang Smart Filtering */}
        <div className="mt-4 pt-3 border-t border-slate-700">
          <p className="text-xs text-slate-500">
            ⭐ Server prioritas • ⚠️ Tolong laporkan kalo link mati/ Ada Iklan ya bre 😊🙏
          </p>
        </div>
      </div>
    </div>
  );
}
