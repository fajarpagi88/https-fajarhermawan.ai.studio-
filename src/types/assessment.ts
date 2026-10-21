export type SoloLevel =
  | 'Prastruktural'
  | 'Unistruktural'
  | 'Multistruktural'
  | 'Relasional'
  | 'Abstrak Diperluas'
  | 'Campuran (Proporsional)';

export type AssessmentType = 'Diagnostik' | 'Formatif' | 'Sumatif';

export type InstrumentType =
  | 'Pilihan Ganda'
  | 'Esai/Uraian'
  | 'Praktik/Unjuk Kerja'
  | 'Observasi'
  | 'Campuran';

export type JurusanType = 'NKPI' | 'TKPI' | 'APPL' | 'APHP';
export type KelasType = 'X' | 'XI' | 'XII';

export interface AssessmentFormData {
  namaSekolah: string; // "SUPM TEGAL"
  namaGuru: string;
  mataPelajaran: string;
  jenjang: 'SMK';
  kelas: KelasType;
  jurusan: JurusanType;
  jenisAsesmen: AssessmentType;
  materiTopik: string;
  tujuanPembelajaran: string;
  capaianPembelajaran?: string;
  bentukInstrumen: InstrumentType;
  jumlahSoal: number;
  tingkatKognitifSolo: SoloLevel;
  instruksiTambahan?: string;
}

export interface KisiKisiItem {
  no: number;
  tujuanPembelajaran: string;
  materi: string;
  indikatorSoal: string;
  levelKognitifSolo: string;
  bentukInstrumen: string;
  nomorButir: number | string;
  bobotSkor: number;
}

export interface SoalItem {
  no: number;
  bentuk: 'Pilihan Ganda' | 'Esai' | 'Praktik' | 'Observasi';
  levelKognitif: string;
  stimulus?: string;
  pertanyaan: string;
  opsi?: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
  instruksiTugas?: string;
  kriteriaKinerja?: string[];
}

export interface KunciItem {
  no: number;
  bentuk: string;
  kunci: string;
  pembahasan: string;
  pedomanPemberianSkor: string;
}

export interface RubrikKriteria {
  aspek: string;
  indikator: string;
  skorMaksimal: number;
  deskripsiKualitas: {
    sangatBaik: string;
    baik: string;
    cukup: string;
    perluBimbingan: string;
  };
}

export interface RubrikPenilaian {
  jenisAsesmen: AssessmentType;
  aturanPenskoran: string;
  skorTotalMaksimal: number;
  rumusNilaiAkhir: string;
  kriteria: RubrikKriteria[];
  tindakLanjutHasil: {
    tuntasKriteria: string;
    remedialAtauPengayaan: string;
    umpanBalikGuru: string;
  };
}

export interface QualityCheck {
  totalSoalSesuai: boolean;
  keselarasanKisiKisi: boolean;
  pilihanGandaLengkapLimaOpsi: boolean;
  catatanVerifikasi: string[];
}

export interface AssessmentResult {
  metadata: {
    namaSekolah: string;
    namaGuru: string;
    mataPelajaran: string;
    jenjang: string;
    kelas: KelasType;
    jurusan: JurusanType;
    jurusanNamaLengkap: string;
    jenisAsesmen: AssessmentType;
    bentukInstrumen: InstrumentType;
    jumlahSoal: number;
    materiTopik: string;
    tujuanPembelajaran: string;
    capaianPembelajaran?: string;
    tingkatKognitifSolo: string;
    instruksiTambahan?: string;
    tanggalDibuat: string;
  };
  petunjukUmum: string[];
  kisiKisi: KisiKisiItem[];
  naskahSoal: SoalItem[];
  kunciJawaban: KunciItem[];
  rubrikPenilaian: RubrikPenilaian;
  qualityCheck: QualityCheck;
}
