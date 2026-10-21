import React from 'react';
import { KisiKisiItem } from '../types/assessment';
import { Table, Layers, CheckCircle } from 'lucide-react';

interface KisiKisiViewProps {
  kisiKisi: KisiKisiItem[];
}

export const KisiKisiView: React.FC<KisiKisiViewProps> = ({ kisiKisi }) => {
  if (!kisiKisi || kisiKisi.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        Belum ada data kisi-kisi yang dimuat.
      </div>
    );
  }

  const getSoloBadgeColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'prastruktural':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'unistruktural':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'multistruktural':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'relasional':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'abstrak diperluas':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-[#0B2545] flex items-center gap-2">
            <Table className="w-4 h-4 text-blue-600" />
            Matriks Distribusi Kisi-Kisi Penulisan Soal
          </h3>
          <p className="text-xs text-slate-500">
            Pemetaan menyeluruh seluruh butir instrumen terhadap indikator dan Taksonomi SOLO
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg self-start sm:self-auto">
          Total Terpetakan: {kisiKisi.length} Butir
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0B2545] text-white">
              <th className="py-3 px-3 font-semibold text-center w-12 border-r border-blue-900">No</th>
              <th className="py-3 px-3 font-semibold border-r border-blue-900 min-w-[180px]">
                Tujuan Pembelajaran (TP)
              </th>
              <th className="py-3 px-3 font-semibold border-r border-blue-900 min-w-[150px]">
                Materi / Pokok Bahasan
              </th>
              <th className="py-3 px-3 font-semibold border-r border-blue-900 min-w-[200px]">
                Indikator Soal / Kinerja
              </th>
              <th className="py-3 px-3 font-semibold text-center border-r border-blue-900 w-32">
                Level SOLO
              </th>
              <th className="py-3 px-3 font-semibold text-center border-r border-blue-900 w-28">
                Bentuk
              </th>
              <th className="py-3 px-3 font-semibold text-center w-14">No. Butir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {kisiKisi.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-3 text-center font-bold text-slate-600 border-r border-slate-100">
                  {item.no}
                </td>
                <td className="py-3 px-3 font-medium text-slate-900 border-r border-slate-100 leading-relaxed">
                  {item.tujuanPembelajaran}
                </td>
                <td className="py-3 px-3 text-slate-700 border-r border-slate-100 leading-relaxed">
                  {item.materi}
                </td>
                <td className="py-3 px-3 text-slate-700 border-r border-slate-100 leading-relaxed">
                  {item.indikatorSoal}
                </td>
                <td className="py-3 px-3 text-center border-r border-slate-100">
                  <span
                    className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-md border ${getSoloBadgeColor(
                      item.levelKognitifSolo
                    )}`}
                  >
                    {item.levelKognitifSolo}
                  </span>
                </td>
                <td className="py-3 px-3 text-center text-slate-700 border-r border-slate-100 font-medium">
                  {item.bentukInstrumen}
                </td>
                <td className="py-3 px-3 text-center font-bold text-blue-700">
                  {item.nomorButir}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
