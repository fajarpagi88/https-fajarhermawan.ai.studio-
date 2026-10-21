import React from 'react';
import { KunciItem } from '../types/assessment';
import { KeyRound, ShieldAlert, CheckCircle2, HelpCircle } from 'lucide-react';

interface KunciJawabanViewProps {
  kunciJawaban: KunciItem[];
}

export const KunciJawabanView: React.FC<KunciJawabanViewProps> = ({ kunciJawaban }) => {
  if (!kunciJawaban || kunciJawaban.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        Belum ada kunci jawaban yang tersedia.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Teacher-only confidentiality notice banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center justify-between text-xs text-amber-900 shadow-sm">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <h4 className="font-bold text-amber-950">
              Dokumen Rahasia Guru Pengampu (Teacher Document Only)
            </h4>
            <p className="text-amber-800 mt-0.5">
              Bagian ini terpisah secara mandiri dari naskah soal taruna. Memuat kunci jawaban definitif, argumentasi teknis ilmiah, dan kriteria penskoran.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-amber-200 text-amber-900 tracking-wider shrink-0">
          Pegangan Guru
        </span>
      </div>

      {/* List of Answer Keys */}
      <div className="space-y-4">
        {kunciJawaban.map((item) => (
          <div
            key={item.no}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-colors"
          >
            {/* Header: Question Number & Key */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {item.no}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {item.bentuk}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Kunci Jawaban Definitif:</span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-sm shadow-xs">
                  <KeyRound className="w-3.5 h-3.5" />
                  {item.kunci}
                </span>
              </div>
            </div>

            {/* Pembahasan & Analisis Ilmiah Kejuruan */}
            <div className="mt-4 space-y-3">
              <div>
                <h5 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                  Pembahasan Ilmiah & Argumentasi Teknis Kejuruan:
                </h5>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 font-sans">
                  {item.pembahasan}
                </p>
              </div>

              {/* Pedoman Penskoran */}
              <div>
                <h5 className="text-xs font-bold text-emerald-800 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Pedoman Pemberian Skor:
                </h5>
                <p className="text-xs text-emerald-900 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200 font-medium leading-relaxed">
                  {item.pedomanPemberianSkor}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
