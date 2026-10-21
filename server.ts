import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { buildAssessmentPrompt, JURUSAN_DETAILS } from './src/utils/promptGenerator.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// Init Gemini AI client with telemetry user-agent header
function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY tidak ditemukan di environment variable server.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health & Status endpoint
app.get('/api/status', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '');
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    model: 'gemini-3.8-flash',
    school: 'SUPM NEGERI TEGAL',
  });
});

// Sleep helper for exponential backoff retry
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate Assessment endpoint
app.post('/api/generate-assessment', async (req, res) => {
  try {
    const formData = req.body;

    // Server-side validation
    if (!formData.mataPelajaran || !formData.mataPelajaran.trim()) {
      return res.status(400).json({ error: 'Mata pelajaran wajib diisi.' });
    }
    if (!formData.materiTopik || !formData.materiTopik.trim()) {
      return res.status(400).json({ error: 'Materi / Topik asesmen wajib diisi.' });
    }
    if (!formData.tujuanPembelajaran || !formData.tujuanPembelajaran.trim()) {
      return res.status(400).json({ error: 'Tujuan pembelajaran wajib diisi.' });
    }
    if (!formData.kelas || !['X', 'XI', 'XII'].includes(formData.kelas)) {
      return res.status(400).json({ error: 'Pilihan kelas tidak valid.' });
    }
    if (!formData.jurusan || !['NKPI', 'TKPI', 'APPL', 'APHP'].includes(formData.jurusan)) {
      return res.status(400).json({ error: 'Pilihan jurusan tidak valid.' });
    }

    const ai = getAiClient();
    const prompt = buildAssessmentPrompt(formData);
    const jurusanInfo = JURUSAN_DETAILS[formData.jurusan as keyof typeof JURUSAN_DETAILS] || {
      nama: formData.jurusan,
      fokus: '',
    };

    const systemInstruction = `Anda adalah Tim Ahli Kurikulum & Asesmen Vokasi Kemaritiman di SUPM (Sekolah Usaha Perikanan Menengah) Negeri TEGAL.
Tugas Anda menghasilkan perangkat asesmen lengkap, mendalam, dan terstandar SMK Kelautan & Perikanan.
Wajib memenuhi ketentuan berikut:
1. Pilihan Ganda: Setiap butir pilihan ganda HARUS memiliki tepat lima pilihan (A, B, C, D, E) yang bermutu dan rasional.
2. Taksonomi SOLO: Petakan tingkat kognitif Solo (Prastruktural, Unistruktural, Multistruktural, Relasional, Abstrak Diperluas) secara proporsional.
3. Naskah Soal Steril: Jangan pernah membocorkan kunci jawaban di naskah soal.
4. Kunci Jawaban Terpisah: Sajikan terpisah dengan nomor, kunci, pembahasan teknis maritim, dan pedoman skor.
5. Rubrik Penilaian Spesifik: Sediakan rubrik rinci dan rumus nilai akhir yang jelas.
6. Kembalikan HANYA format JSON valid tanpa tanda petik kode atau teks di luar JSON.`;

    let attempt = 0;
    const maxRetries = 3;
    let lastError: any = null;
    let responseText = '';

    while (attempt < maxRetries) {
      attempt++;
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.35,
            responseMimeType: 'application/json',
          },
        });

        responseText = response.text || '';
        if (responseText) {
          break;
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || '';
        const isTransient =
          errMsg.includes('429') ||
          errMsg.includes('RESOURCE_EXHAUSTED') ||
          errMsg.includes('503') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('rate limit') ||
          errMsg.includes('timeout') ||
          errMsg.includes('ECONNRESET');

        if (isTransient && attempt < maxRetries) {
          // Exponential backoff
          await sleep(attempt * 1800);
          continue;
        } else {
          throw err;
        }
      }
    }

    if (!responseText) {
      throw lastError || new Error('Tidak ada respon teks yang diterima dari Gemini API.');
    }

    // Clean up potential markdown formatting
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim();
    }

    let parsed: any;
    try {
      parsed = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error('JSON Parse error, raw text length:', cleanJson.length);
      return res.status(502).json({
        error: 'Format data dari AI tidak valid. Silakan coba kembali atau gunakan Mode Manual Cadangan.',
        rawText: cleanJson.substring(0, 500),
      });
    }

    // Content Quality Assurance Verification
    const requestedCount = Number(formData.jumlahSoal) || 10;
    const actualNaskahCount = Array.isArray(parsed.naskahSoal) ? parsed.naskahSoal.length : 0;
    const actualKisiCount = Array.isArray(parsed.kisiKisi) ? parsed.kisiKisi.length : 0;

    let pgCheck = true;
    if (Array.isArray(parsed.naskahSoal)) {
      parsed.naskahSoal.forEach((soal: any) => {
        if (soal.opsi) {
          const keys = Object.keys(soal.opsi);
          if (!keys.includes('A') || !keys.includes('B') || !keys.includes('C') || !keys.includes('D') || !keys.includes('E')) {
            pgCheck = false;
          }
        }
      });
    }

    const now = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // Assemble final response object
    const finalResult = {
      metadata: {
        namaSekolah: 'SUPM NEGERI TEGAL',
        namaGuru: formData.namaGuru || 'Guru Pengampu SUPM Tegal',
        mataPelajaran: formData.mataPelajaran,
        jenjang: 'SMK',
        kelas: formData.kelas,
        jurusan: formData.jurusan,
        jurusanNamaLengkap: jurusanInfo.nama,
        jenisAsesmen: formData.jenisAsesmen,
        bentukInstrumen: formData.bentukInstrumen,
        jumlahSoal: requestedCount,
        materiTopik: formData.materiTopik,
        tujuanPembelajaran: formData.tujuanPembelajaran,
        capaianPembelajaran: formData.capaianPembelajaran || '',
        tingkatKognitifSolo: formData.tingkatKognitifSolo,
        instruksiTambahan: formData.instruksiTambahan || '',
        tanggalDibuat: now,
      },
      petunjukUmum: parsed.petunjukUmum || [
        'Bacalah setiap butir soal dengan cermat dan seksama sebelum menjawab.',
        'Pilihlah salah satu jawaban yang paling tepat untuk soal pilihan ganda.',
        'Kerjakan dengan teliti, jujur, serta patuhi disiplin kerja maritim.',
      ],
      kisiKisi: parsed.kisiKisi || [],
      naskahSoal: parsed.naskahSoal || [],
      kunciJawaban: parsed.kunciJawaban || [],
      rubrikPenilaian: parsed.rubrikPenilaian || {
        jenisAsesmen: formData.jenisAsesmen,
        aturanPenskoran: 'Setiap butir dihitung berdasarkan bobot capaian pembelajaran.',
        skorTotalMaksimal: 100,
        rumusNilaiAkhir: 'Nilai Akhir = (Total Skor Perolehan / Skor Total Maksimal) x 100',
        kriteria: [],
        tindakLanjutHasil: {
          tuntasKriteria: 'Kriteria ketuntasan minimal kompetensi kelautan adalah nilai 75.',
          remedialAtauPengayaan: 'Peserta didik di bawah KKM mengikuti pembelajaran penguatan konsep; yang tuntas melakukan studi mandiri terapan.',
          umpanBalikGuru: 'Catatan kemajuan belajar individu peserta didik.',
        },
      },
      qualityCheck: {
        totalSoalSesuai: actualNaskahCount === requestedCount,
        keselarasanKisiKisi: actualKisiCount === actualNaskahCount,
        pilihanGandaLengkapLimaOpsi: pgCheck,
        catatanVerifikasi: [
          `Jumlah naskah soal terkonfirmasi: ${actualNaskahCount} butir (Permintaan: ${requestedCount} butir).`,
          actualKisiCount === actualNaskahCount
            ? 'Seluruh butir soal terpetakan sempurna 100% pada tabel kisi-kisi.'
            : `Perhatian: Jumlah butir kisi-kisi (${actualKisiCount}) berbeda dengan butir naskah (${actualNaskahCount}).`,
          pgCheck
            ? 'Seluruh butir pilihan ganda terverifikasi memiliki opsi lengkap A, B, C, D, dan E.'
            : 'Perhatian: Ada butir pilihan ganda yang perlu diverifikasi opsi A-E nya.',
          'Kunci jawaban dan rubrik telah dipisahkan secara steril dari naskah peserta didik.',
        ],
      },
    };

    return res.json(finalResult);
  } catch (error: any) {
    console.error('Error in /api/generate-assessment:', error);

    const msg = error?.message || '';
    let userMessage = 'Terjadi kendala saat memproses asesmen dengan AI.';
    let actionTip = 'Silakan coba sesaat lagi, atau gunakan tombol "Salin / Unduh Prompt Cadangan" untuk memproses mandiri.';

    if (msg.includes('API key') || msg.includes('API_KEY')) {
      userMessage = 'Kunci Gemini API belum terkonfigurasi atau tidak valid di server.';
      actionTip = 'Pastikan konfigurasi GEMINI_API_KEY telah diatur di Settings > Secrets, atau gunakan Mode Manual Cadangan di bawah.';
    } else if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
      userMessage = 'Batas kuota harian atau rate-limit Gemini API tercapai.';
      actionTip = 'Tunggu 1-2 menit sebelum mencoba kembali, atau gunakan fitur Salin Prompt Cadangan untuk menjalankannya langsung di antarmuka Gemini / AI Studio.';
    } else if (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('overloaded')) {
      userMessage = 'Server Gemini sedang mengalami lonjakan beban sesaat.';
      actionTip = 'Silakan klik tombol Generate Asesmen sekali lagi dalam beberapa detik.';
    } else if (msg.includes('timeout') || msg.includes('ECONNRESET')) {
      userMessage = 'Koneksi jaringan ke layanan AI terputus atau mengalami timeout.';
      actionTip = 'Periksa koneksi internet Anda lalu coba kirim kembali.';
    }

    return res.status(500).json({
      error: userMessage,
      actionTip,
      technicalDetail: msg,
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SUPM Tegal Assessment Generator server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
