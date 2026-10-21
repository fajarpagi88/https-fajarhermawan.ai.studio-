import React from 'react';
import { RubrikPenilaian } from '../types/assessment';
import { Calculator, CheckSquare, Award, ArrowRight, ShieldCheck, Target } from 'lucide-react';

interface RubrikPenilaianViewProps {
  rubrik: RubrikPenilaian;
}

export const RubrikPenilaianView: React.FC<RubrikPenilaianViewProps> = ({ rubrik }) => {
  if (!rubrik) {
    return (
      <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        Belum ada rubrik penilaian yang tersedia.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards: Skor Maksimal & Rumus Nilai */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Aturan Penskoran */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-[#0B2545] font-bold text-xs uppercase tracking-wider mb-2">
            <CheckSquare className="w-4 h-4 text-blue-600" />
            Aturan Penskoran
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {rubrik.aturanPenskoran}
          </p>
        </div>

        {/* Skor Maksimal */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-[#0B2545] font-bold text-xs uppercase tracking-wider mb-2">
            <Award className="w-4 h-4 text-amber-500" />
            Skor Total Maksimum
          </div>
          <div className="text-2xl font-extrabold text-[#0B2545]">
            {rubrik.skorTotalMaksimal} <span className="text-xs font-normal text-slate-500">Poin</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Akumulasi nilai seluruh butir instrumen kejuruan
          </p>
        </div>

        {/* Rumus Nilai Akhir */}
        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/50 shadow-sm">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider mb-2">
            <Calculator className="w-4 h-4 text-blue-700" />
            Rumus Konversi Nilai Akhir
          </div>
          <p className="text-xs font-mono font-bold text-blue-950 bg-white px-2.5 py-1.5 rounded border border-blue-200">
            {rubrik.rumusNilaiAkhir}
          </p>
          <p className="text-[11px] text-blue-800 mt-1">
            Skala standar rapor SMK (Rentang 0 - 100)
          </p>
        </div>
      </div>

      {/* Tabel Matriks Kriteria Kualitas Respon */}
      {rubrik.kriteria && rubrik.kriteria.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#0B2545] flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              Matriks Gradasi Kualitas Capaian Respon (Rubrik Holistik / Analitik)
            </h4>
            <span className="text-xs text-slate-500">
              4 Tingkat Kemampuan (Level 1 - 4)
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0B2545] text-white">
                  <th className="py-3 px-3.5 font-semibold w-1/4 border-r border-blue-900">
                    Aspek & Indikator Kinerja
                  </th>
                  <th className="py-3 px-3 font-semibold w-[18%] border-r border-blue-900 bg-emerald-900/40 text-emerald-200">
                    Sangat Baik (Skor 4)
                  </th>
                  <th className="py-3 px-3 font-semibold w-[18%] border-r border-blue-900 bg-blue-900/40 text-blue-200">
                    Baik (Skor 3)
                  </th>
                  <th className="py-3 px-3 font-semibold w-[18%] border-r border-blue-900 bg-amber-900/40 text-amber-200">
                    Cukup (Skor 2)
                  </th>
                  <th className="py-3 px-3 font-semibold w-[18%] bg-rose-900/40 text-rose-200">
                    Perlu Bimbingan (Skor 1)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {rubrik.kriteria.map((krit, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3.5 border-r border-slate-200 bg-slate-50/40">
                      <div className="font-bold text-slate-900">{krit.aspek}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{krit.indikator}</div>
                    </td>
                    <td className="py-3 px-3 border-r border-slate-200 text-slate-700 leading-relaxed bg-emerald-50/20">
                      {krit.deskripsiKualitas.sangatBaik}
                    </td>
                    <td className="py-3 px-3 border-r border-slate-200 text-slate-700 leading-relaxed bg-blue-50/20">
                      {krit.deskripsiKualitas.baik}
                    </td>
                    <td className="py-3 px-3 border-r border-slate-200 text-slate-700 leading-relaxed bg-amber-50/20">
                      {krit.deskripsiKualitas.cukup}
                    </td>
                    <td className="py-3 px-3 text-slate-700 leading-relaxed bg-rose-50/20">
                      {krit.deskripsiKualitas.perluBimbingan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rencana Tindak Lanjut Asesmen (Diferensiasi Pembelajaran) */}
      {rubrik.tindakLanjutHasil && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <ArrowRight className="w-4 h-4 text-blue-600" />
            Rencana Tindak Lanjut & Diferensiasi Pembelajaran
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">
                Kriteria Ketuntasan Minimal (KKM):
              </span>
              <p className="text-slate-700 leading-relaxed">
                {rubrik.tindakLanjutHasil.tuntasKriteria}
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">
                Program Remedial & Pengayaan:
              </span>
              <p className="text-slate-700 leading-relaxed">
                {rubrik.tindakLanjutHasil.remedialAtauPengayaan}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
