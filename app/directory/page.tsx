// app/directory/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getAllAnime } from "@/lib/api";
import Link from "next/link";

export default function DirectoryPage() {
  // --- STATE ---
  const [groupedData, setGroupedData] = useState<any[]>([]); // Menyimpan data MASTER (List of Groups)
  const [currentList, setCurrentList] = useState<any[]>([]); // Menyimpan daftar anime untuk huruf yg dipilih
  const [displayData, setDisplayData] = useState<any[]>([]); // Menyimpan data yg DITAMPILKAN (Paginated)

  const [selectedLetter, setSelectedLetter] = useState("A");
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 60;

  const alphabet = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // 1. FETCH DATA (Sekali saja)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllAnime();

        // Cek struktur JSON (berdasarkan data yang kamu kirim)
        // Data ada di: res.data.list
        const rawData = res.data?.list || [];

        setGroupedData(rawData);

        // Langsung jalankan filter default 'A'
        handleSelectLetter(rawData, "A");
      } catch (err) {
        console.error("Error Fetching:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. FUNGSI PILIH HURUF (Logic Baru)
  const handleSelectLetter = (dataGroups: any[], letter: string) => {
    setSelectedLetter(letter);
    setCurrentPage(1); // Reset page

    let resultList: any[] = [];

    if (letter === "#") {
      // KHUSUS #: Gabungkan semua grup yang BUKAN huruf A-Z
      // API kamu memisahkan "1", "2", "3", "#". Kita gabung semua jadi satu di tab #
      const nonLetterGroups = dataGroups.filter((group: any) => {
        // Cek apakah startWith adalah huruf A-Z
        const isLetter = /^[A-Z]$/i.test(group.startWith);
        return !isLetter;
      });

      nonLetterGroups.forEach((group: any) => {
        if (group.animeList) {
          resultList = [...resultList, ...group.animeList];
        }
      });
    } else {
      const targetGroup = dataGroups.find(
        (group: any) => group.startWith.toUpperCase() === letter,
      );

      if (targetGroup && targetGroup.animeList) {
        resultList = targetGroup.animeList;
      }
    }

    setCurrentList(resultList);
  };

  // 3. PAGINATION SLICER
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const sliced = currentList.slice(startIndex, endIndex);
    setDisplayData(sliced);
  }, [currentList, currentPage]);

  const totalPages = Math.ceil(currentList.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen relative pb-20">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">
          Direktori Anime <span className="text-cyan-400">A-Z</span>
        </h1>

        {/* TAB HURUF */}
        <div className="flex flex-wrap gap-2 p-4 bg-slate-800 rounded-xl border border-slate-700">
          {alphabet.map((char) => (
            <button
              key={char}
              onClick={() => handleSelectLetter(groupedData, char)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                selectedLetter === char
                  ? "bg-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)] scale-110"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
              }`}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-cyan-500 rounded-full"></div>
          <p className="text-slate-400 mt-2">Sedang memuat data...</p>
        </div>
      ) : (
        <div className="animate-fade-in">
          <p className="text-slate-400 mb-4 text-sm flex justify-between items-center">
            <span>
              Huruf "{selectedLetter}": {currentList.length} Anime
            </span>
            <span>
              Halaman {currentPage} dari {totalPages || 1}
            </span>
          </p>

          {displayData.length === 0 ? (
            <div className="text-center py-20 text-slate-500 border border-dashed border-slate-700 rounded-xl">
              Tidak ada anime untuk huruf ini.
            </div>
          ) : (
            // LIST DATA
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {displayData.map((anime: any, idx) => (
                <Link
                  key={idx}
                  href={`/anime/${anime.animeId}`}
                  className="block p-3 bg-slate-800/50 hover:bg-slate-700 border border-slate-700/50 hover:border-cyan-500 rounded-lg transition-colors truncate text-slate-300 hover:text-cyan-400"
                >
                  <span className="mr-2 text-cyan-500">•</span>
                  {anime.title}
                </Link>
              ))}
            </div>
          )}

          {/* TOMBOL PREV/NEXT */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-slate-800 disabled:opacity-50 hover:bg-cyan-600 text-white rounded-lg transition-colors"
              >
                ← Prev
              </button>

              <span className="text-slate-400 text-sm">
                Page {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-slate-800 disabled:opacity-50 hover:bg-cyan-600 text-white rounded-lg transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Floating Mascot */}
      <div className="fixed bottom-0 right-0 z-20 pointer-events-none">
        <img
          src="/nempel.png"
          alt="Mascot"
          className="h-[25vh] md:h-[40vh] w-auto object-contain object-bottom opacity-100"
        />
      </div>
    </div>
  );
}
