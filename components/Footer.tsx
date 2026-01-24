// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-xl font-bold text-white mb-2">HanimeStream</h2>
        <p className="text-slate-400 text-sm mb-4">
          Nonton anime gratis tanpa iklan yang mengganggu (semoga).
        </p>
        <div className="text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Dibuat untuk tujuan belajar - Rhan
          Nzr.
        </div>
      </div>
    </footer>
  );
}
