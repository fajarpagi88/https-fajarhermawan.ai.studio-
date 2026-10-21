import React from 'react';
import { Compass, Anchor, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface HeaderProps {
  apiStatus: {
    online: boolean;
    hasKey: boolean;
    loading: boolean;
  };
}

export const Header: React.FC<HeaderProps> = ({ apiStatus }) => {
  return (
    <header className="bg-gradient-to-r from-[#0B2545] via-[#133E87] to-[#1E3A8A] text-white shadow-xl border-b-4 border-[#F59E0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & School Identity */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/95 p-1 shadow-md ring-2 ring-amber-400/80 flex items-center justify-center overflow-hidden transition-transform transform group-hover:scale-105">
                <img
                  src="/assets/aistudio/Logo_supm_03334eae.jpg"
                  alt="Logo SUPM Tegal"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1 text-slate-900 shadow">
                <Anchor className="w-3.5 h-3.5 text-slate-900" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 tracking-wider">
                  KEMENTERIAN KELAUTAN & PERIKANAN
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  SMK KEMARITIMAN
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white mt-1">
                SUPM TEGAL <span className="text-amber-400 font-light">ASSESMEN MENDALAM</span>
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 font-medium line-clamp-1">
                Sistem Perancangan Kisi-kisi, Naskah Soal, Kunci Terpisah & Rubrik SOLO Berstandar Vokasi
              </p>
            </div>
          </div>

          {/* Indicators & Capabilities */}
          <div className="flex flex-wrap items-center gap-2.5 self-center md:self-end">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-xs text-blue-100">
              <Compass className="w-4 h-4 text-amber-300 animate-[spin_12s_linear_infinite]" />
              <span>Taksonomi SOLO</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-xs">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Gemini 3.8 Flash</span>
              {apiStatus.loading ? (
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              ) : apiStatus.hasKey ? (
                <span className="inline-flex items-center gap-1 text-emerald-300 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Aktif
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-300 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Cadangan
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
