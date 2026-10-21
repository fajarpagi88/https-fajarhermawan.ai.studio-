import { AssessmentFormData, JurusanType } from '../types/assessment';

export const JURUSAN_DETAILS: Record<JurusanType, { nama: string; fokus: string }> = {
  NKPI: {
    nama: 'Nautika Kapal Penangkap Ikan',
    fokus: 'Navigasi bahari, radar, olah gerak kapal penangkap ikan, meteorologi laut, alat tangkap ikan, keselamatan kerja pelayaran (STCW-F / SOLAS), penanganan hasil tangkap di laut.',
  },
  TKPI: {
    nama: 'Teknika Kapal Penangkap Ikan',
    fokus: 'Motor induk kapal (diesel engine), motor bantu, sistem kelistrikan kapal, sistem refrigerasi & palka berpendingin, mesin hidrolik geladak, perawatan mesin kapal perikanan.',
  },
  APPL: {
    nama: 'Agribisnis Perikanan Air Payau dan Laut',
    fokus: 'Pembenihan dan pembesaran udang/ikan (vaname, kerapu, bandeng, dll.), manajemen kualitas air tambak/KJA, biosecurity perikanan, formulasi dan efisiensi pakan, pengendalian hama & penyakit ikan.',
  },
  APHP: {
    nama: 'Agribisnis Pengolahan Hasil Perikanan',
    fokus: 'Penanganan pascapanen ikan segar, sanitasi dan higiene pengolahan, GMP & SSOP, sistem jaminan mutu HACCP, diversifikasi produk olahan perikanan (surimi, presto, pengalengan, pengasapan, nilai tambah).',
  },
};

export function buildAssessmentPrompt(formData: AssessmentFormData): string {
  const jurusanInfo = JURUSAN_DETAILS[formData.jurusan];

  return `Anda adalah Tim Pengembang Kurikulum dan Spesialis Asesmen Pembelajaran SMK Kemaritiman di SUPM (Sekolah Usaha Perikanan Menengah) Negeri TEGAL.
Tugas Anda adalah merancang dan menyusun PERANGKAT ASESMEN LENGKAP & MENDALAM dengan standar vokasi kelautan dan perikanan Indonesia.

IDENTITAS ASESMEN:
- Satuan Pendidikan : SUPM TEGAL
- Nama Guru Pengampu: ${formData.namaGuru || 'Guru Pengampu SUPM Tegal'}
- Mata Pelajaran    : ${formData.mataPelajaran}
- Jenjang Pendidikan: ${formData.jenjang} (Sekolah Menengah Kejuruan)
- Tingkat / Kelas   : Kelas ${formData.kelas}
- Program Keahlian  : ${formData.jurusan} - ${jurusanInfo.nama}
- Fokus Kejuruan    : ${jurusanInfo.fokus}
- Jenis Asesmen     : ${formData.jenisAsesmen}
- Bentuk Instrumen  : ${formData.bentukInstrumen}
- Jumlah Soal/Tugas : ${formData.jumlahSoal} butir
- Basis Kognitif    : Taksonomi SOLO (${formData.tingkatKognitifSolo})
- Topik / Materi    : ${formData.materiTopik}
- Tujuan Pembelajaran:
${formData.tujuanPembelajaran}
${formData.capaianPembelajaran ? `- Capaian Pembelajaran / Indikator:\n${formData.capaianPembelajaran}` : ''}
${formData.instruksiTambahan ? `- Instruksi Tambahan Khusus:\n${formData.instruksiTambahan}` : ''}

PEDOMAN PENTING & LOGIKA JENIS ASESMEN:
1. LOGIKA JENIS ASESMEN:
   ${
     formData.jenisAsesmen === 'Diagnostik'
       ? 'Asesmen DIAGNOSTIK: Fokuskan instrumen untuk mengidentifikasi pengetahuan prasyarat, kesiapan belajar, gaya belajar/pemahaman konsep dasar, serta mendeteksi miskonsepsi awal peserta didik. Kisi-kisi dan rubrik harus memetakan kategori kesiapan (Belum Siap, Siap, Mahir) dan rencana tindak lanjut diferensiasi pembelajaran.'
       : formData.jenisAsesmen === 'Formatif'
       ? 'Asesmen FORMATIF: Fokuskan untuk memantau kemajuan proses pembelajaran, mendiagnosis kesulitan belajar yang sedang dihadapi peserta didik saat materi berlangsung, dan memberikan umpan balik (feedback) reflektif serta rekomendasi perbaikan pembelajaran secara langsung.'
       : 'Asesmen SUMATIF: Berfungsi mengukur ketercapaian tujuan pembelajaran (Capaian Pembelajaran) di akhir unit/bab/semester. Kisi-kisi harus memetakan seluruh butir dengan nomor, indikator, tingkat SOLO, bobot skor, kunci jawaban definitif, dan pedoman penskoran standar kelulusan kejuruan.'
   }

2. ATURAN BENTUK INSTRUMEN:
   - Jika bentuk instrumen Pilihan Ganda (atau bagian PG pada Campuran):
     * Setiap butir WAJIB memiliki TEPAT 5 OPSI (A, B, C, D, E).
     * Opsi harus homogen, masuk akal secara teknis kelautan/perikanan, tidak menggunakan opsi "Semua benar" / "Semua salah", dan hanya ada satu kunci jawaban yang paling tepat.
     * Sertakan stimulus kontekstual kejuruan (skenario lapangan, data navigasi/mesin/tambak/uji lab, atau studi kasus SUPM).
   - Jika bentuk instrumen Esai / Uraian:
     * Soal menuntut penalaran Taksonomi SOLO (Relasional atau Abstrak Diperluas), kemampuan analisis, perbandingan, perancangan solusi teknis, atau evaluasi prosedur.
   - Jika Praktik / Unjuk Kerja atau Observasi:
     * Sajikan instruksi kerja terstruktur, alat & bahan, langkah keselamatan kerja maritim/K3, serta kriteria kinerja yang terukur.
   - Jika Campuran:
     * Kombinasikan Pilihan Ganda (opsi A-E) dan Esai secara proporsional hingga mencapai total ${formData.jumlahSoal} butir.

3. TAKSONOMI SOLO (Structure of Observed Learning Outcomes):
   Petakan setiap butir soal ke level SOLO:
   - Prastruktural: Pengenalan fakta dasar/miskonsepsi
   - Unistruktural: Satu aspek/istilah/komponen teknis spesifik
   - Multistruktural: Menjelaskan beberapa aspek/tahapan prosedur terpisah
   - Relasional: Mengaitkan antar komponen, analisis sebab-akibat, pemecahan masalah teknis
   - Abstrak Diperluas: Generalisasi prinsip ke situasi maritim baru, perancangan hipotesis/sistem

4. KETENTUAN KONTEN & PEMISAHAN:
   - NASKAH SOAL: WAJIB STERIL dan siap cetak untuk taruna/peserta didik. TIDAK BOLEH menampilkan kunci atau tanda jawaban.
   - KUNCI JAWABAN: Dibuat TERPISAH, lengkap dengan alasan/pembahasan teknis, serta pedoman skor.
   - RUBRIK: Memuat kriteria jelas, skor maksimal, rumus nilai akhir (Skor Perolehan / Skor Total x 100), dan rencana tindak lanjut.
   - TOTAL BUTIR: HARUS TEPAT ${formData.jumlahSoal} butir soal/tugas.

FORMAT KELUARAN WAJIB (JSON):
Berikan respon HANYA berupa JSON valid (tanpa teks pengantar dan tanpa markdown fence selain JSON murni) dengan struktur skema berikut:
{
  "petunjukUmum": [
    "Periksa dan baca soal dengan teliti sebelum menjawab.",
    "Utamakan keselamatan kerja dan kejujuran akademis.",
    "..."
  ],
  "kisiKisi": [
    {
      "no": 1,
      "tujuanPembelajaran": "...",
      "materi": "...",
      "indikatorSoal": "Disajikan ..., peserta didik dapat ...",
      "levelKognitifSolo": "Relasional",
      "bentukInstrumen": "Pilihan Ganda",
      "nomorButir": 1,
      "bobotSkor": 1
    }
  ],
  "naskahSoal": [
    {
      "no": 1,
      "bentuk": "Pilihan Ganda",
      "levelKognitif": "Relasional",
      "stimulus": "Skenario/data teknis singkat jika ada...",
      "pertanyaan": "Kalimat pertanyaan lengkap...",
      "opsi": {
        "A": "Pilihan A",
        "B": "Pilihan B",
        "C": "Pilihan C",
        "D": "Pilihan D",
        "E": "Pilihan E"
      },
      "instruksiTugas": "...",
      "kriteriaKinerja": ["Langkah 1", "Langkah 2"]
    }
  ],
  "kunciJawaban": [
    {
      "no": 1,
      "bentuk": "Pilihan Ganda",
      "kunci": "C",
      "pembahasan": "Penjelasan ilmiah/teknis...",
      "pedomanPemberianSkor": "Skor 1 jika benar, 0 jika salah"
    }
  ],
  "rubrikPenilaian": {
    "jenisAsesmen": "${formData.jenisAsesmen}",
    "aturanPenskoran": "Pedoman perhitungan skor...",
    "skorTotalMaksimal": 100,
    "rumusNilaiAkhir": "Nilai Akhir = (Total Skor Perolehan / Skor Maksimal) x 100",
    "kriteria": [
      {
        "aspek": "Penguasaan Konsep & Prosedur",
        "indikator": "Ketepatan identifikasi dan pemecahan masalah",
        "skorMaksimal": 4,
        "deskripsiKualitas": {
          "sangatBaik": "Skor 4: Penjelasan mendalam, data teknis akurat, penerapan SOLO Abstrak Diperluas tepat.",
          "baik": "Skor 3: Penjelasan runtut, konsep benar, analisis relasional tepat.",
          "cukup": "Skor 2: Menjelaskan beberapa aspek terpisah (multistruktural) dengan sedikit ketidaktepatan.",
          "perluBimbingan": "Skor 1: Hanya menyebutkan satu aspek dasar (unistruktural) atau terdapat miskonsepsi."
        }
      }
    ],
    "tindakLanjutHasil": {
      "tuntasKriteria": "Peserta didik mencapai nilai >= 75 menunjukkan penguasaan kompetensi tuntas.",
      "remedialAtauPengayaan": "Remedial fokus pada butir SOLO relasional; pengayaan berupa studi kasus operasional nyata.",
      "umpanBalikGuru": "Catatan umpan balik individual untuk kemajuan belajar."
    }
  },
  "qualityCheck": {
    "totalSoalSesuai": true,
    "keselarasanKisiKisi": true,
    "pilihanGandaLengkapLimaOpsi": true,
    "catatanVerifikasi": [
      "Semua butir soal pilihan ganda telah diperiksa dan memiliki opsi A sampai E.",
      "Kisi-kisi terdistribusi sesuai Taksonomi SOLO dan tujuan pembelajaran kejuruan."
    ]
  }
}`;
}
