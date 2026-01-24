// components/Navbar.tsx
"use client";

import Link from "next/link";
import { Search, Globe, Menu, X } from "lucide-react"; // Tambahkan Menu & X
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [keyword, setKeyword] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State untuk menu mobile
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/search/${keyword}`);
      setIsMobileMenuOpen(false); // Tutup menu jika user search via mobile (opsional)
    }
  };

  // Fungsi helper untuk menutup menu saat link diklik
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        {/* LOGO */}
        {/* Shrink-0 agar logo tidak gepeng saat search bar melebar */}
        <Link
          href="/"
          className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-blue-600 shrink-0"
          onClick={closeMenu}
        >
          Hanime<span className="hidden sm:inline">Stream</span>
        </Link>

        {/* SEARCH BAR (Responsive) */}
        {/* Di mobile textnya agak kecil, margin disesuaikan */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative group">
            <input
              type="text"
              placeholder="Cari..."
              className="w-full bg-slate-900 text-slate-200 text-sm rounded-full pl-9 pr-4 py-2 border border-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
          </div>
        </form>

        {/* DESKTOP MENU LINKS (Hidden di Mobile) */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/jadwal" className="hover:text-white transition-colors">
            Jadwal
          </Link>
          <Link href="/genre" className="hover:text-white transition-colors">
            Genre
          </Link>
          <Link
            href="/completed"
            className="hover:text-white transition-colors"
          >
            Tamat
          </Link>

          <a
            href="https://raihan.tarakan.top"
            target="_blank"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-full border border-slate-700 transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span className="text-xs">Blog Saya</span>
          </a>
        </div>

        {/* MOBILE MENU TOGGLE BUTTON (Visible only on Mobile) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-slate-300 hover:text-white p-1"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {/* Muncul jika isMobileMenuOpen === true */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-slate-950 border-b border-slate-800 shadow-xl animate-in slide-in-from-top-5 fade-in duration-200">
          <div className="flex flex-col p-4 space-y-4 text-slate-300 font-medium">
            <Link
              href="/"
              onClick={closeMenu}
              className="hover:text-cyan-400 py-2 border-b border-slate-800/50"
            >
              Home
            </Link>
            <Link
              href="/jadwal"
              onClick={closeMenu}
              className="hover:text-cyan-400 py-2 border-b border-slate-800/50"
            >
              Jadwal Rilis
            </Link>
            <Link
              href="/genre"
              onClick={closeMenu}
              className="hover:text-cyan-400 py-2 border-b border-slate-800/50"
            >
              Daftar Genre
            </Link>
            <Link
              href="/completed"
              onClick={closeMenu}
              className="hover:text-cyan-400 py-2 border-b border-slate-800/50"
            >
              Anime Tamat
            </Link>

            <a
              href="https://raihan.tarakan.top"
              target="_blank"
              onClick={closeMenu}
              className="flex items-center gap-2 text-cyan-400 py-2"
            >
              <Globe className="h-4 w-4" />
              <span>Kunjungi Blog Saya</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
