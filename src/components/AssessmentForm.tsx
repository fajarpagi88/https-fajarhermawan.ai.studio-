import React, { useState } from 'react';
import {
  AssessmentFormData,
  AssessmentType,
  InstrumentType,
  JurusanType,
  KelasType,
  SoloLevel,
} from '../types/assessment';
import {
  Sparkles,
  BookOpen,
  User,
  GraduationCap,
  Layers,
  FileSpreadsheet,
  HelpCircle,
  Copy,
  Wand2,
  Lock,
  Ship,
  Wrench,
  Fish,
  Utensils,
  CheckCircle2,
} from 'lucide-react';
import { JURUSAN_DETAILS } from '../utils/promptGenerator';

interface AssessmentFormProps {
  formData: AssessmentFormData;
  onChange: (updated: Partial<AssessmentFormData>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onOpenManualPrompt: () => void;
}

const VOCATIONAL_PRESETS: {
  title: string;
  jurusan: JurusanType;
  mapel: string;
  kelas: KelasType;
  jenis: AssessmentType;
  bentuk: InstrumentType;
  jumlah: number;
  solo: SoloLevel;
  materi: string;
  tujuan: string;
  capaian?: string;
  instruksi?: string;
}[] = [
  {
    title: 'Navigasi Radar & Penentuan Posisi (NKPI)',
    jurusan: 'NKPI',
    mapel: 'Ilmu Pelayaran Datar & Navigasi Elektronik',
    kelas: 'XI',
    jenis: 'Sumatif',
    bentuk: 'Pilihan Ganda',
    jumlah: 10,
    solo: 'Relasional',
    materi: 'Prinsip Kerja Radar Bahari, Baringan Sejati, dan Pencegahan Tubrukan di Laut (P2TL / COLREG)',
    tujuan: 'Peserta didik mampu mengidentifikasi target pada layar radar maritim, menentukan haluan kapal penangkap ikan dengan baringan kompas, serta menganalisis situasi bahaya tubrukan sesuai aturan COLREG 1972.',
    capaian: 'Taruna mampu mengoperasikan instrumen navigasi elektronik dan menentukan posisi kapal dengan akurat.',
    instruksi: 'Sertakan istilah standar IMO / STCW-F. Butir soal harus menghadirkan skenario cuaca buruk atau persimpangan alur pelayaran.',
  },
  {
    title: 'Perawatan Mesin Diesel Penggerak Utama (TKPI)',
    jurusan: 'TKPI',
    mapel: 'Motor Penggerak Kapal Perikanan',
    kelas: 'XII',
    jenis: 'Formatif',
    bentuk: 'Campuran',
    jumlah: 10,
    solo: 'Multistruktural',
    materi: 'Sistem Injeksi Bahan Bakar, Indikator Tekanan Oli, dan Overheating Mesin Diesel 4 Langkah',
    tujuan: 'Peserta didik dapat menganalisis gejala gangguan sistem pendingin dan pelumasan pada motor diesel kapal penangkap ikan, serta merumuskan langkah penanganan darurat di laut.',
    capaian: 'Taruna mampu melakukan troubleshooting permesinan bantu dan motor induk kapal perikanan.',
    instruksi: 'Kombinasikan pilihan ganda opsi A-E untuk analisis gejala dan esai untuk urutan langkah perbaikan darurat.',
  },
  {
    title: 'Kualitas Air & Biosecurity Tambak Vaname (APPL)',
    jurusan: 'APPL',
    mapel: 'Teknik Budidaya Krustasea Air Payau',
    kelas: 'XI',
    jenis: 'Diagnostik',
    bentuk: 'Pilihan Ganda',
    jumlah: 5,
    solo: 'Prastruktural',
    materi: 'Parameter Fisika-Kimia Air Tambak: DO, pH, Salinitas, Alkalinitas, dan Nitrit Toksik',
    tujuan: 'Mendiagnosis kesiapan awal taruna dalam memahami batas kritis parameter kualitas air tambak udang vaname dan mengidentifikasi miskonsepsi peran aerator/kincir air.',
    capaian: 'Peserta didik siap mengikuti modul manajemen kualitas air tambak intensif.',
    instruksi: 'Fokuskan butir soal untuk mengelompokkan siswa ke kategori kesiapan: Belum Siap, Siap, atau Mahir.',
  },
  {
    title: 'Penerapan HACCP & Mutu Surimi (APHP)',
    jurusan: 'APHP',
    mapel: 'Pengawasan Mutu dan Keamanan Pangan Perikanan',
    kelas: 'XII',
    jenis: 'Sumatif',
    bentuk: 'Esai/Uraian',
    jumlah: 5,
    solo: 'Abstrak Diperluas',
    materi: 'Critical Control Point (CCP) Penanganan Rantai Dingin Ikan Segar dan Pembuatan Produk Surimi',
    tujuan: 'Peserta didik mampu merancang matriks analisis bahaya (hazard analysis) dan menetapkan batas kritis (critical limits) pada tahap pencucian daging lumatan ikan untuk mencegah dekomposisi histamin.',
    capaian: 'Taruna menguasai prosedur standar jaminan mutu GMP/SSOP dan regulasi ekspor perikanan.',
    instruksi: 'Sajikan studi kasus pabrik pengolahan ikan dengan penyimpangan suhu palka.',
  },
];

export const AssessmentForm: React.FC<AssessmentFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isLoading,
  onOpenManualPrompt,
}) => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.namaGuru.trim()) {
      errors.namaGuru = 'Nama guru wajib diisi';
    }
    if (!formData.mataPelajaran.trim()) {
      errors.mataPelajaran = 'Mata pelajaran wajib diisi';
    }
    if (!formData.materiTopik.trim()) {
      errors.materiTopik = 'Materi / Topik wajib diisi';
    }
    if (!formData.tujuanPembelajaran.trim()) {
      errors.tujuanPembelajaran = 'Tujuan pembelajaran wajib diisi';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      onSubmit();
    }
  };

  const applyPreset = (preset: (typeof VOCATIONAL_PRESETS)[0]) => {
    onChange({
      jurusan: preset.jurusan,
      mataPelajaran: preset.mapel,
      kelas: preset.kelas,
      jenisAsesmen: preset.jenis,
      bentukInstrumen: preset.bentuk,
      jumlahSoal: preset.jumlah,
      tingkatKognitifSolo: preset.solo,
      materiTopik: preset.materi,
      tujuanPembelajaran: preset.tujuan,
      capaianPembelajaran: preset.capaian,
      instruksiTambahan: preset.instruksi,
    });
    setFormErrors({});
  };

  const getJurusanIcon = (jur: JurusanType) => {
    switch (jur) {
      case 'NKPI':
        return <Ship className="w-4 h-4 text-blue-600" />;
      case 'TKPI':
        return <Wrench className="w-4 h-4 text-amber-600" />;
      case 'APPL':
        return <Fish className="w-4 h-4 text-emerald-600" />;
      case 'APHP':
        return <Utensils className="w-4 h-4 text-rose-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Form Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-[#0B2545] px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            Formulir Perangkat Asesmen Pembelajaran
          </h2>
          <p className="text-xs text-slate-300">
            Lengkapi data di bawah ini untuk membuat asesmen berstandar SUPM Tegal secara otomatis
          </p>
        </div>

        {/* Quick Presets Dropdown/Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
            <Wand2 className="w-3.5 h-3.5" /> Template Cepat:
          </span>
          <div className="flex gap-1 flex-wrap">
            {VOCATIONAL_PRESETS.map((p) => (
              <button
                key={p.jurusan}
                type="button"
                onClick={() => applyPreset(p)}
                className="px-2 py-0.5 text-[11px] font-semibold bg-white/10 hover:bg-white/20 active:bg-amber-400 active:text-slate-900 text-white rounded border border-white/20 transition-colors"
                title={`Muat template asesmen ${p.title}`}
              >
                {p.jurusan}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={validateAndSubmit} className="p-6 space-y-6">
        {/* SECTION 1: IDENTITAS GURU & SEKOLAH */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <User className="w-4 h-4 text-[#0B2545]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              1. Identitas Satuan Pendidikan & Guru
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama Sekolah (Readonly & Fixed) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Sekolah <span className="text-slate-400 font-normal">(Otomatis & Tetap)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value="SUPM TEGAL"
                  readOnly
                  className="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 cursor-not-allowed select-none pl-9"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <span className="absolute right-3 top-2 text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                  SMK Terakreditasi A
                </span>
              </div>
            </div>

            {/* Nama Guru */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Guru Pengampu <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.namaGuru}
                onChange={(e) => {
                  onChange({ namaGuru: e.target.value });
                  if (formErrors.namaGuru) setFormErrors({ ...formErrors, namaGuru: '' });
                }}
                placeholder="Contoh: Capt. Bambang Sujarwo, M.Mar. / Dra. Sri Wahyuni"
                className={`w-full bg-white border ${
                  formErrors.namaGuru ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 focus:border-blue-500'
                } rounded-lg px-3 py-2 text-sm text-slate-800 outline-none transition-all`}
              />
              {formErrors.namaGuru && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">{formErrors.namaGuru}</p>
              )}
            </div>

            {/* Mata Pelajaran */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mata Pelajaran Kejuruan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.mataPelajaran}
                onChange={(e) => {
                  onChange({ mataPelajaran: e.target.value });
                  if (formErrors.mataPelajaran) setFormErrors({ ...formErrors, mataPelajaran: '' });
                }}
                placeholder="Contoh: Navigasi Elektronik & Radar, Motor Induk Kapal, Teknik Pembenihan Vaname, HACCP Perikanan"
                className={`w-full bg-white border ${
                  formErrors.mataPelajaran
                    ? 'border-rose-500 ring-1 ring-rose-500'
                    : 'border-slate-300 focus:border-blue-500'
                } rounded-lg px-3 py-2 text-sm text-slate-800 outline-none transition-all`}
              />
              {formErrors.mataPelajaran && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">{formErrors.mataPelajaran}</p>
              )}
            </div>

            {/* Jenjang, Kelas, Jurusan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jenjang Pendidikan
              </label>
              <div className="flex items-center gap-2">
                <span className="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700">
                  SMK (Sekolah Menengah Kejuruan)
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tingkat / Kelas <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['X', 'XI', 'XII'] as KelasType[]).map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => onChange({ kelas: cls })}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      formData.kelas === cls
                        ? 'bg-[#0B2545] text-white border-[#0B2545] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Kelas {cls}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Jurusan Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Program Keahlian / Jurusan di SUPM Tegal <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {(['NKPI', 'TKPI', 'APPL', 'APHP'] as JurusanType[]).map((jur) => {
                const info = JURUSAN_DETAILS[jur];
                const isSelected = formData.jurusan === jur;
                return (
                  <button
                    key={jur}
                    type="button"
                    onClick={() => onChange({ jurusan: jur })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-sm text-[#0B2545]">
                        {getJurusanIcon(jur)}
                        <span>{jur}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </div>
                    <p className="text-[11px] font-medium text-slate-800 line-clamp-1">{info.nama}</p>
                    <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">{info.fokus}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 2: RANCANGAN ASESMEN & LOGIKA PEDAGOGIK */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <GraduationCap className="w-4 h-4 text-[#0B2545]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              2. Rancangan Asesmen & Logika Pedagogik
            </h3>
          </div>

          {/* Jenis Asesmen with distinct pedagogy logic cards */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Jenis Asesmen Pembelajaran <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(
                [
                  {
                    type: 'Diagnostik',
                    color: 'purple',
                    badge: 'Awal Pembelajaran',
                    desc: 'Petakan kesiapan awal, pengetahuan prasyarat, & miskonsepsi. Menghasilkan tindak lanjut kelompok belajar.',
                  },
                  {
                    type: 'Formatif',
                    color: 'blue',
                    badge: 'Proses Pembelajaran',
                    desc: 'Pantau perkembangan pemahaman, beri umpan balik reflektif spesifik, & rekomendasi perbaikan proses.',
                  },
                  {
                    type: 'Sumatif',
                    color: 'emerald',
                    badge: 'Akhir Unit / Bab',
                    desc: 'Ukur ketercapaian kompetensi akhir secara terstandar dengan kisi-kisi, kunci definitif, & pedoman penskoran.',
                  },
                ] as const
              ).map((item) => {
                const isSelected = formData.jenisAsesmen === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => onChange({ jenisAsesmen: item.type })}
                    className={`p-3.5 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-[#0B2545]">{item.type}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bentuk Instrumen, Jumlah Soal, Tingkat SOLO */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Bentuk Instrumen */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bentuk Instrumen <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.bentukInstrumen}
                onChange={(e) => onChange({ bentukInstrumen: e.target.value as InstrumentType })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 font-medium"
              >
                <option value="Pilihan Ganda">Pilihan Ganda (Wajib 5 Opsi: A-E)</option>
                <option value="Esai/Uraian">Esai / Uraian Mendalam</option>
                <option value="Praktik/Unjuk Kerja">Praktik / Unjuk Kerja Maritim</option>
                <option value="Observasi">Observasi / Pengamatan Lapangan</option>
                <option value="Campuran">Campuran (Pilihan Ganda + Esai)</option>
              </select>
              <p className="text-[10px] text-slate-500 mt-1">
                {formData.bentukInstrumen === 'Pilihan Ganda' && 'Otomatis dibuat dengan 5 pilihan homogen A, B, C, D, E.'}
                {formData.bentukInstrumen === 'Praktik/Unjuk Kerja' && 'Memuat instruksi kerja dan rubrik indikator unjuk kerja.'}
                {formData.bentukInstrumen === 'Esai/Uraian' && 'Memuat rubrik kriteria kualitas jawaban bertingkat.'}
                {formData.bentukInstrumen === 'Campuran' && 'Proporsi PG dan Esai dipetakan teratur.'}
              </p>
            </div>

            {/* Jumlah Soal / Tugas */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jumlah Soal / Tugas <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-7 gap-1">
                {[5, 10, 15, 20, 25, 30, 40].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => onChange({ jumlahSoal: num })}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      formData.jumlahSoal === num
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Terpilih: <strong>{formData.jumlahSoal} butir soal</strong>
              </p>
            </div>

            {/* Tingkat Kognitif Taksonomi SOLO */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tingkat Kognitif Taksonomi SOLO <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.tingkatKognitifSolo}
                onChange={(e) => onChange({ tingkatKognitifSolo: e.target.value as SoloLevel })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 font-medium"
              >
                <option value="Prastruktural">Prastruktural (Pengetahuan awal / Miskonsepsi)</option>
                <option value="Unistruktural">Unistruktural (1 Aspek / Istilah teknis tunggal)</option>
                <option value="Multistruktural">Multistruktural (Beberapa aspek terpisah)</option>
                <option value="Relasional">Relasional (Integrasi konsep & Analisis sistem)</option>
                <option value="Abstrak Diperluas">Abstrak Diperluas (Generalisasi & Perancangan)</option>
                <option value="Campuran (Proporsional)">Campuran Proporsional (SOLO Bertingkat)</option>
              </select>
              <p className="text-[10px] text-slate-500 mt-1">
                SOLO Taxonomy mengukur kedalaman respon peserta didik secara objektif.
              </p>
            </div>
          </div>

          {/* Materi / Topik & Tujuan Pembelajaran */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Materi Pokok / Topik Pembelajaran <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.materiTopik}
                onChange={(e) => {
                  onChange({ materiTopik: e.target.value });
                  if (formErrors.materiTopik) setFormErrors({ ...formErrors, materiTopik: '' });
                }}
                placeholder="Tuliskan topik atau unit kompetensi yang diujikan (misal: Prosedur Olah Gerak Kapal saat Badai, Sistem Pendingin Kompresor Refrigerasi, Pengendalian Mutu Ikan Segar Organoleptik)..."
                className={`w-full bg-white border ${
                  formErrors.materiTopik
                    ? 'border-rose-500 ring-1 ring-rose-500'
                    : 'border-slate-300 focus:border-blue-500'
                } rounded-lg p-3 text-sm text-slate-800 outline-none transition-all leading-relaxed`}
              />
              {formErrors.materiTopik && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">{formErrors.materiTopik}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tujuan Pembelajaran (TP) <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.tujuanPembelajaran}
                onChange={(e) => {
                  onChange({ tujuanPembelajaran: e.target.value });
                  if (formErrors.tujuanPembelajaran) setFormErrors({ ...formErrors, tujuanPembelajaran: '' });
                }}
                placeholder="Tuliskan tujuan pembelajaran yang ingin dicapai peserta didik (misal: Taruna mampu mengidentifikasi parameter operasional dan mengatasi permasalahan gangguan mesin diesel)..."
                className={`w-full bg-white border ${
                  formErrors.tujuanPembelajaran
                    ? 'border-rose-500 ring-1 ring-rose-500'
                    : 'border-slate-300 focus:border-blue-500'
                } rounded-lg p-3 text-sm text-slate-800 outline-none transition-all leading-relaxed`}
              />
              {formErrors.tujuanPembelajaran && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">{formErrors.tujuanPembelajaran}</p>
              )}
            </div>
          </div>

          {/* Optional: Capaian & Instruksi Tambahan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Capaian Pembelajaran / Indikator Tambahan <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <input
                type="text"
                value={formData.capaianPembelajaran || ''}
                onChange={(e) => onChange({ capaianPembelajaran: e.target.value })}
                placeholder="Contoh: Elemen Capaian SKKNI No. 248 atau Standar Kurikulum Merdeka Kejuruan"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instruksi Tambahan Khusus <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <input
                type="text"
                value={formData.instruksiTambahan || ''}
                onChange={(e) => onChange({ instruksiTambahan: e.target.value })}
                placeholder="Contoh: Sertakan standar keselamatan maritim SOLAS, sertakan perhitungan debit air"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: TOMBOL UTAMA & CADANGAN */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
            <span>Materi asesmen akan diproses secara aman melalui backend Gemini API</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Mode Manual Cadangan button */}
            <button
              type="button"
              onClick={onOpenManualPrompt}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              title="Jika API sedang sibuk atau offline, buat prompt lengkap untuk disalin ke ChatGPT/Gemini"
            >
              <Copy className="w-4 h-4 text-slate-500" />
              <span>Mode Manual Cadangan</span>
            </button>

            {/* Tombol Utama: Generate Asesmen */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
                isLoading
                  ? 'bg-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-[#0B2545] via-[#133E87] to-blue-700 hover:from-slate-900 hover:to-blue-800 hover:shadow-xl active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memproses Asesmen (Gemini AI)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Asesmen</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
