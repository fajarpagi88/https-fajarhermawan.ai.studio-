/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AssessmentFormData, AssessmentResult } from './types/assessment';
import { Header } from './components/Header';
import { AssessmentForm } from './components/AssessmentForm';
import { QualityCheckBanner } from './components/QualityCheckBanner';
import { KisiKisiView } from './components/KisiKisiView';
import { NaskahSoalView } from './components/NaskahSoalView';
import { KunciJawabanView } from './components/KunciJawabanView';
import { RubrikPenilaianView } from './components/RubrikPenilaianView';
import { ExportModal } from './components/ExportModal';
import { ManualPromptModal } from './components/ManualPromptModal';
import { buildAssessmentPrompt, JURUSAN_DETAILS } from './utils/promptGenerator';
import {
  Table,
  FileText,
  KeyRound,
  Award,
  Download,
  Copy,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  FileCheck,
} from 'lucide-react';

const INITIAL_FORM: AssessmentFormData = {
  namaSekolah: 'SUPM TEGAL',
  namaGuru: '',
  mataPelajaran: 'Navigasi Datar dan Penentuan Posisi Kapal',
  jenjang: 'SMK',
  kelas: 'XI',
  jurusan: 'NKPI',
  jenisAsesmen: 'Sumatif',
  bentukInstrumen: 'Pilihan Ganda',
  jumlahSoal: 10,
  tingkatKognitifSolo: 'Relasional',
  materiTopik: 'Prinsip Kerja Radar Bahari, Baringan Sejati, dan Pencegahan Tubrukan di Laut (P2TL / COLREG)',
  tujuanPembelajaran: 'Peserta didik mampu mengidentifikasi target pada layar radar maritim, menentukan haluan kapal penangkap ikan dengan baringan kompas, serta menganalisis situasi bahaya tubrukan sesuai aturan COLREG 1972.',
  capaianPembelajaran: 'Taruna mampu mengoperasikan instrumen navigasi elektronik dan menentukan posisi kapal dengan akurat sesuai standar STCW-F.',
  instruksiTambahan: 'Sertakan istilah maritim dan skenario pelayaran di perairan dangkal atau cuaca berombak.',
};

export default function App() {
  const [formData, setFormData] = useState<AssessmentFormData>(INITIAL_FORM);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'kisi' | 'soal' | 'kunci' | 'rubrik'>('soal');
  const [errorInfo, setErrorInfo] = useState<{ message: string; tip?: string } | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [apiStatus, setApiStatus] = useState({ online: true, hasKey: true, loading: true });

  const resultsRef = useRef<HTMLDivElement>(null);

  // Check server and API status on start
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setApiStatus({
          online: true,
          hasKey: Boolean(data.hasApiKey),
          loading: false,
        });
      })
      .catch(() => {
        setApiStatus({ online: false, hasKey: false, loading: false });
      });
  }, []);

  const handleFormChange = (updated: Partial<AssessmentFormData>) => {
    setFormData((prev) => ({ ...prev, ...updated }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorInfo(null);

    try {
      const response = await fetch('/api/generate-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menghasilkan asesmen dari server.');
      }

      // Success: update assessment result
      setAssessmentResult(data);
      setActiveTab('soal');

      // Scroll gently to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: any) {
      console.error('Error during generation:', err);
      setErrorInfo({
        message: err.message || 'Terjadi kesalahan saat memanggil API Gemini.',
        tip: 'Jika kuota API sedang habis atau server sibuk, Anda dapat menggunakan "Mode Manual Cadangan" untuk menyalin prompt terstruktur dan menjalankannya langsung di Google Gemini atau ChatGPT.',
      });
      // NOTE: We deliberately DO NOT clear assessmentResult so the teacher doesn't lose previous results!
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPromptTxt = () => {
    const prompt = buildAssessmentPrompt(formData);
    const blob = new Blob([prompt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SUPM_TEGAL_Prompt_Asesmen_${formData.mataPelajaran.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyCurrentTab = () => {
    if (!assessmentResult) return;
    let text = '';
    const meta = assessmentResult.metadata;

    if (activeTab === 'soal') {
      text = `NASKAH SOAL ASESMEN ${meta.jenisAsesmen.toUpperCase()}\nSUPM NEGERI TEGAL\nMata Pelajaran: ${meta.mataPelajaran}\nKelas: ${meta.kelas} (${meta.jurusan})\n\n`;
      text += 'PETUNJUK UMUM:\n' + assessmentResult.petunjukUmum.map((p, i) => `${i + 1}. ${p}`).join('\n') + '\n\n';
      text += assessmentResult.naskahSoal
        .map((s) => {
          let q = `${s.no}. ${s.pertanyaan}\n`;
          if (s.stimulus) q = `[Stimulus: ${s.stimulus}]\n` + q;
          if (s.opsi) {
            (['A', 'B', 'C', 'D', 'E'] as const).forEach((k) => {
              if (s.opsi?.[k]) q += `   ${k}. ${s.opsi[k]}\n`;
            });
          }
          if (s.instruksiTugas) q += `   Instruksi: ${s.instruksiTugas}\n`;
          return q;
        })
        .join('\n');
    } else if (activeTab === 'kunci') {
      text = `KUNCI JAWABAN & PEMBAHASAN\nSUPM NEGERI TEGAL - ${meta.mataPelajaran}\n\n`;
      text += assessmentResult.kunciJawaban
        .map((k) => `${k.no}. Kunci: ${k.kunci}\nPembahasan: ${k.pembahasan}\nPedoman Skor: ${k.pedomanPemberianSkor}\n`)
        .join('\n');
    } else if (activeTab === 'kisi') {
      text = `KISI-KISI ASESMEN\nSUPM NEGERI TEGAL - ${meta.mataPelajaran}\n\n`;
      text += assessmentResult.kisiKisi
        .map(
          (k) =>
            `No. ${k.no} | TP: ${k.tujuanPembelajaran} | Materi: ${k.materi} | Indikator: ${k.indikatorSoal} | SOLO: ${k.levelKognitifSolo} | Bentuk: ${k.bentukInstrumen}`
        )
        .join('\n');
    } else if (activeTab === 'rubrik') {
      const r = assessmentResult.rubrikPenilaian;
      text = `RUBRIK PENILAIAN\nSUPM NEGERI TEGAL - ${meta.mataPelajaran}\nAturan: ${r.aturanPenskoran}\nRumus: ${r.rumusNilaiAkhir}\nSkor Maksimal: ${r.skorTotalMaksimal}\n\n`;
      text += r.kriteria
        .map(
          (k) =>
            `Aspek: ${k.aspek} (${k.indikator})\n- Sangat Baik: ${k.deskripsiKualitas.sangatBaik}\n- Baik: ${k.deskripsiKualitas.baik}\n- Cukup: ${k.deskripsiKualitas.cukup}\n- Perlu Bimbingan: ${k.deskripsiKualitas.perluBimbingan}\n`
        )
        .join('\n');
    }

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans">
      {/* Header with SUPM Tegal Logo & Status */}
      <Header apiStatus={apiStatus} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error Alert (if any) */}
        {errorInfo && (
          <div className="bg-rose-50 border-l-4 border-rose-600 rounded-xl p-4 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <h4 className="text-sm font-bold text-rose-900">
                  Kendala Pemrosesan: {errorInfo.message}
                </h4>
                {errorInfo.tip && (
                  <p className="text-xs text-rose-800 leading-relaxed">{errorInfo.tip}</p>
                )}
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => setIsManualModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Buka Mode Manual Cadangan</span>
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 hover:bg-rose-100 text-rose-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Coba Ulang</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input Form Section */}
        <AssessmentForm
          formData={formData}
          onChange={handleFormChange}
          onSubmit={handleGenerate}
          isLoading={isLoading}
          onOpenManualPrompt={() => setIsManualModalOpen(true)}
        />

        {/* Results Presentation Section */}
        <div ref={resultsRef}>
          {isLoading && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center space-y-4">
              <div className="inline-flex p-4 rounded-2xl bg-blue-50 text-blue-700 ring-4 ring-blue-100">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <h3 className="text-lg font-bold text-[#0B2545]">
                Sedang Menyusun Perangkat Asesmen SUPM Tegal...
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Gemini 3.8 Flash sedang memetakan kisi-kisi, menyusun naskah soal bebas kunci (opsi A-E), memvalidasi kunci jawaban definitif, serta merancang rubrik penskoran Taksonomi SOLO.
              </p>
            </div>
          )}

          {!isLoading && assessmentResult && (
            <div className="space-y-6">
              {/* Quality Check Banner */}
              <QualityCheckBanner
                qualityCheck={assessmentResult.qualityCheck}
                totalSoal={assessmentResult.metadata.jumlahSoal}
              />

              {/* Assessment Workspace Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                {/* Result Header & Action Toolbar */}
                <div className="bg-[#0B2545] p-5 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-900">
                        {assessmentResult.metadata.jenisAsesmen.toUpperCase()}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">
                        Kelas {assessmentResult.metadata.kelas} • {assessmentResult.metadata.jurusan}
                      </span>
                      <span className="text-[11px] text-slate-300">
                        {assessmentResult.metadata.tanggalDibuat}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mt-1 text-white">
                      {assessmentResult.metadata.mataPelajaran}
                    </h3>
                    <p className="text-xs text-blue-200">
                      Guru: <strong>{assessmentResult.metadata.namaGuru}</strong> | Bentuk: {assessmentResult.metadata.bentukInstrumen} ({assessmentResult.metadata.jumlahSoal} Butir)
                    </p>
                  </div>

                  {/* Export & Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={handleCopyCurrentTab}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-semibold text-xs flex items-center gap-1.5 border border-white/20 transition-colors shadow-xs"
                      title="Salin isi tab saat ini ke clipboard"
                    >
                      {copiedAll ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-300">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Salin Teks Tab</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setIsExportModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all"
                    >
                      <Download className="w-4 h-4 text-slate-950" />
                      <span>Unduh Word (.docx) & PDF</span>
                    </button>
                  </div>
                </div>

                {/* Navigation Tabs (4 Sections from Specification) */}
                <div className="border-b border-slate-200 bg-slate-50/70 px-4 flex items-center gap-1 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('soal')}
                    className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                      activeTab === 'soal'
                        ? 'border-blue-600 text-blue-700 bg-white shadow-xs rounded-t-lg'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Naskah Soal Peserta Didik</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px]">
                      {assessmentResult.naskahSoal.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('kisi')}
                    className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                      activeTab === 'kisi'
                        ? 'border-blue-600 text-blue-700 bg-white shadow-xs rounded-t-lg'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                    }`}
                  >
                    <Table className="w-4 h-4" />
                    <span>Kisi-Kisi Penulisan Soal</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('kunci')}
                    className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                      activeTab === 'kunci'
                        ? 'border-blue-600 text-blue-700 bg-white shadow-xs rounded-t-lg'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                    }`}
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Kunci Jawaban Terpisah</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                      Guru
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('rubrik')}
                    className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                      activeTab === 'rubrik'
                        ? 'border-blue-600 text-blue-700 bg-white shadow-xs rounded-t-lg'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>Rubrik & Pedoman Penskoran</span>
                  </button>
                </div>

                {/* Tab Contents View */}
                <div className="p-6">
                  {activeTab === 'soal' && (
                    <NaskahSoalView
                      naskahSoal={assessmentResult.naskahSoal}
                      petunjukUmum={assessmentResult.petunjukUmum}
                    />
                  )}

                  {activeTab === 'kisi' && (
                    <KisiKisiView kisiKisi={assessmentResult.kisiKisi} />
                  )}

                  {activeTab === 'kunci' && (
                    <KunciJawabanView kunciJawaban={assessmentResult.kunciJawaban} />
                  )}

                  {activeTab === 'rubrik' && (
                    <RubrikPenilaianView rubrik={assessmentResult.rubrikPenilaian} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 mt-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">SUPM TEGAL</span>
            <span>•</span>
            <span>Sekolah Usaha Perikanan Menengah Negeri Tegal</span>
          </div>
          <p className="text-slate-500 text-center sm:text-right">
            Sistem Pembuat Perangkat Asesmen SMK Terpadu | Taksonomi SOLO & Standar Kemaritiman
          </p>
        </div>
      </footer>

      {/* Export Modal for DOCX & PDF Downloads */}
      {assessmentResult && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          assessment={assessmentResult}
          onDownloadPromptTxt={handleDownloadPromptTxt}
        />
      )}

      {/* Manual Prompt Modal (Fallback Mode) */}
      <ManualPromptModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        promptText={buildAssessmentPrompt(formData)}
        onDownloadTxt={handleDownloadPromptTxt}
      />
    </div>
  );
}
