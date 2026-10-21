import React, { useState } from 'react';
import { AssessmentResult } from '../types/assessment';
import { generateDocxBlob, ExportSection } from '../utils/docxExport';
import { generatePdfBlob } from '../utils/pdfExport';
import {
  Download,
  FileText,
  FileCode,
  X,
  Check,
  FileCheck,
  Table,
  HelpCircle,
  KeyRound,
  Award,
  Layers,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: AssessmentResult;
  onDownloadPromptTxt: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  assessment,
  onDownloadPromptTxt,
}) => {
  const [downloadingSection, setDownloadingSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportDocx = async (section: ExportSection) => {
    const key = `docx-${section}`;
    setDownloadingSection(key);
    try {
      const blob = await generateDocxBlob(assessment, section);
      const nameMap: Record<ExportSection, string> = {
        all: `SUPM_TEGAL_PaketLengkap_${assessment.metadata.mataPelajaran.replace(/\s+/g, '_')}.docx`,
        kisi: `SUPM_TEGAL_KisiKisi_${assessment.metadata.mataPelajaran.replace(/\s+/g, '_')}.docx`,
        soal: `SUPM_TEGAL_NaskahSoal_${assessment.metadata.mataPelajaran.replace(/\s+/g, '_')}.docx`,
        kunci: `SUPM_TEGAL_KunciJawaban_${assessment.metadata.mataPelajaran.replace(/\s+/g, '_')}.docx`,
        rubrik: `SUPM_TEGAL_Rubrik_${assessment.metadata.mataPelajaran.replace(/\s+/g, '_')}.docx`,
      };
      triggerDownload(blob, nameMap[section]);
    } catch (err) {
      console.error('Error generating DOCX:', err);
    } finally {
      setDownloadingSection(null);
    }
  };

  const handleExportPdf = async (section: ExportSection) => {
    const key = `pdf-${section}`;
    setDownloadingSection(key);
    try {
      const blob = await generatePdfBlob(assessment, section);
      const nameMap: Record<ExportSection, string> = {
        all: `SUPM_TEGAL_PaketLengkap_${assessment.metadata.mataPelajaran.replace(/\s+/g, '_')}.pdf`,
        kisi: `SUPM_TEGAL_KisiKisi_${assessment.metadata.mataPelajaran.replace(/\s+/g, '_')}.pdf`,
        soal: `SUPM_TEGAL_NaskahSoal_${assessment.metadata.mataPelajaran.replace(/\s+/g, '_')}.pdf`,
        kunci: `SUPM_TEGAL_KunciJawaban_${assessment.metadata.mataPelajaran.replace(/\s+/g, '_')}.pdf`,
        rubrik: `SUPM_TEGAL_Rubrik_${assessment.metadata.mataPelajaran.replace(/\s+/g, '_')}.pdf`,
      };
      triggerDownload(blob, nameMap[section]);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setDownloadingSection(null);
    }
  };

  const exportOptions: {
    section: ExportSection;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      section: 'all',
      title: 'Semua Perangkat (Satu Paket Lengkap)',
      description: 'Kisi-kisi, Naskah Soal, Kunci Jawaban terpisah, & Rubrik lengkap dalam 1 file rapi dengan Kop Surat.',
      icon: <Layers className="w-5 h-5 text-blue-600" />,
      color: 'border-blue-300 bg-blue-50/50',
    },
    {
      section: 'soal',
      title: 'Naskah Soal Saja (Lembar Peserta Didik)',
      description: 'Naskah steril tanpa kunci jawaban, siap digandakan atau dicetak untuk taruna SUPM.',
      icon: <FileText className="w-5 h-5 text-emerald-600" />,
      color: 'border-emerald-200 bg-emerald-50/30',
    },
    {
      section: 'kisi',
      title: 'Kisi-Kisi Soal Saja',
      description: 'Tabel distribusi kompetensi, indikator soal, level SOLO, dan nomor butir.',
      icon: <Table className="w-5 h-5 text-purple-600" />,
      color: 'border-purple-200 bg-purple-50/30',
    },
    {
      section: 'kunci',
      title: 'Kunci Jawaban & Pembahasan Saja',
      description: 'Dokumen pegangan guru: kunci definitif, argumentasi ilmiah, dan pedoman skor.',
      icon: <KeyRound className="w-5 h-5 text-amber-600" />,
      color: 'border-amber-200 bg-amber-50/30',
    },
    {
      section: 'rubrik',
      title: 'Rubrik Penilaian Saja',
      description: 'Pedoman penskoran, rumus nilai akhir, dan tabel kriteria 4 tingkat kualitas.',
      icon: <Award className="w-5 h-5 text-rose-600" />,
      color: 'border-rose-200 bg-rose-50/30',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#0B2545] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-400/30 text-amber-400">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Unduh Dokumen Asesmen Berstandar</h3>
              <p className="text-xs text-blue-200">
                Pilih format Word (.docx) atau PDF untuk kebutuhan administrasi pembelajaran
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="text-xs text-slate-600">
            Dokumen resmi dilengkapi Kop Surat SUPM Tegal, identitas kejuruan, format bahasa Indonesia, dan tanda tangan pengesahan.
          </div>

          <div className="space-y-3">
            {exportOptions.map((opt) => (
              <div
                key={opt.section}
                className={`p-4 rounded-xl border ${opt.color} flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs shrink-0">
                    {opt.icon}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{opt.title}</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </div>

                {/* Download Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  {/* DOCX button */}
                  <button
                    onClick={() => handleExportDocx(opt.section)}
                    disabled={Boolean(downloadingSection)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
                  >
                    {downloadingSection === `docx-${opt.section}` ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FileText className="w-3.5 h-3.5" />
                    )}
                    <span>DOCX</span>
                  </button>

                  {/* PDF button */}
                  <button
                    onClick={() => handleExportPdf(opt.section)}
                    disabled={Boolean(downloadingSection)}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
                  >
                    {downloadingSection === `pdf-${opt.section}` ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FileCheck className="w-3.5 h-3.5" />
                    )}
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Unduh Prompt Cadangan (.txt) */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Unduh Prompt Cadangan (.txt)
              </span>
              <span className="text-[11px] text-slate-500">
                Simpan teks instruksi lengkap untuk keperluan arsip atau ChatGPT/Gemini eksternal
              </span>
            </div>
            <button
              onClick={onDownloadPromptTxt}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <FileCode className="w-3.5 h-3.5 text-slate-500" />
              <span>Unduh .txt</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Format resmi SUPM Negeri Tegal | Standar Akreditasi KKP
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
