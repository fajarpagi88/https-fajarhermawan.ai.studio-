import React from 'react';
import { QualityCheck } from '../types/assessment';
import { ShieldCheck, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface QualityCheckBannerProps {
  qualityCheck: QualityCheck;
  totalSoal: number;
}

export const QualityCheckBanner: React.FC<QualityCheckBannerProps> = ({
  qualityCheck,
  totalSoal,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-900/90 via-slate-900 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-blue-500/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-amber-300 border border-blue-400/30 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm sm:text-base text-white">
                Pemeriksaan Mutu Perangkat Asesmen (Quality Assurance)
              </h4>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-semibold">
                Terverifikasi Otomatis
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              Standar validitas kisi-kisi, kelengkapan opsi A-E, dan sterilitas naskah soal SUPM Tegal
            </p>
          </div>
        </div>

        {/* Badges Checklist */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
              qualityCheck.totalSoalSesuai
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-amber-950/60 border-amber-500/50 text-amber-300'
            }`}
          >
            {qualityCheck.totalSoalSesuai ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5" />
            )}
            <span>Jumlah Butir: {totalSoal} Soal</span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
              qualityCheck.keselarasanKisiKisi
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-amber-950/60 border-amber-500/50 text-amber-300'
            }`}
          >
            {qualityCheck.keselarasanKisiKisi ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5" />
            )}
            <span>Kisi-Kisi Selaras 100%</span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
              qualityCheck.pilihanGandaLengkapLimaOpsi
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-amber-950/60 border-amber-500/50 text-amber-300'
            }`}
          >
            {qualityCheck.pilihanGandaLengkapLimaOpsi ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5" />
            )}
            <span>Opsi PG Lengkap (A-E)</span>
          </div>
        </div>
      </div>

      {/* Verification notes for the teacher */}
      {qualityCheck.catatanVerifikasi && qualityCheck.catatanVerifikasi.length > 0 && (
        <div className="mt-3.5 pt-3 border-t border-white/10 flex items-start gap-2 text-xs text-blue-200">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            {qualityCheck.catatanVerifikasi.map((catatan, i) => (
              <p key={i} className="text-slate-300">
                • {catatan}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
