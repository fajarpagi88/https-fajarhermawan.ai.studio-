import React from 'react';
import { SoalItem } from '../types/assessment';
import { FileText, AlertCircle, HelpCircle, CheckSquare } from 'lucide-react';

interface NaskahSoalViewProps {
  naskahSoal: SoalItem[];
  petunjukUmum: string[];
}

export const NaskahSoalView: React.FC<NaskahSoalViewProps> = ({
  naskahSoal,
  petunjukUmum,
}) => {
  if (!naskahSoal || naskahSoal.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        Belum ada naskah soal yang tersedia.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notice Banner: Sheet is sterile without answers */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Lembar Soal Peserta Didik (Steril):</strong> Kunci jawaban tidak ditampilkan pada lembar ini dan siap dicetak/diujikan kepada taruna.
          </span>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
          Siap Cetak
        </span>
      </div>

      {/* Petunjuk Umum Pengerjaan */}
      {petunjukUmum && petunjukUmum.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            Petunjuk Umum Pengerjaan Soal
          </h4>
          <ol className="list-decimal list-inside space-y-1 text-xs text-slate-700 leading-relaxed">
            {petunjukUmum.map((p, idx) => (
              <li key={idx} className="pl-1">
                {p}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Butir-butir Soal */}
      <div className="space-y-5">
        {naskahSoal.map((soal) => {
          return (
            <div
              key={soal.no}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-colors"
            >
              {/* Header Butir */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#0B2545] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {soal.no}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                    {soal.bentuk}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500">
                  Level SOLO: <strong className="text-slate-700">{soal.levelKognitif}</strong>
                </span>
              </div>

              {/* Stimulus Kasus / Data (Jika ada) */}
              {soal.stimulus && (
                <div className="mb-3 p-3 bg-blue-50/60 border-l-4 border-blue-600 rounded-r-lg text-xs text-slate-800 leading-relaxed font-serif">
                  <span className="font-bold text-blue-900 block font-sans mb-1 text-[11px]">
                    [Stimulus Kontekstual Kejuruan / Skenario Maritim]
                  </span>
                  {soal.stimulus}
                </div>
              )}

              {/* Pertanyaan Utama */}
              <div className="text-sm font-medium text-slate-900 leading-relaxed mb-4 pl-0.5">
                {soal.pertanyaan}
              </div>

              {/* Opsi Pilihan Ganda (A - E) */}
              {soal.opsi && (
                <div className="space-y-2 pl-2">
                  {(['A', 'B', 'C', 'D', 'E'] as const).map((optKey) => {
                    const optText = soal.opsi?.[optKey];
                    if (!optText) return null;

                    return (
                      <div
                        key={optKey}
                        className="flex items-start gap-3 p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 transition-colors text-xs text-slate-800"
                      >
                        <span className="w-5 h-5 rounded-md bg-white border border-slate-300 font-bold text-[11px] text-slate-700 flex items-center justify-center shrink-0 shadow-xs">
                          {optKey}
                        </span>
                        <span className="pt-0.5 leading-relaxed">{optText}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Instruksi Tugas Khusus Praktik / Unjuk Kerja */}
              {soal.instruksiTugas && (
                <div className="mt-3 p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-xs text-amber-900">
                  <span className="font-bold block mb-1">Instruksi Pelaksanaan Tugas:</span>
                  <p className="leading-relaxed">{soal.instruksiTugas}</p>
                </div>
              )}

              {/* Kriteria Kinerja Observasi / Praktik */}
              {soal.kriteriaKinerja && soal.kriteriaKinerja.length > 0 && (
                <div className="mt-3 pl-2">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">
                    Indikator Unjuk Kerja yang Dinilai:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                    {soal.kriteriaKinerja.map((k, ki) => (
                      <li key={ki}>{k}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
