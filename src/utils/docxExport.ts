import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  PageBreak,
} from 'docx';
import { AssessmentResult } from '../types/assessment';

export type ExportSection = 'all' | 'kisi' | 'soal' | 'kunci' | 'rubrik';

function createHeaderParagraph(meta: AssessmentResult['metadata'], subTitle: string): Paragraph[] {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'KEMENTERIAN KELAUTAN DAN PERIKANAN',
          bold: true,
          size: 22,
          font: 'Arial',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'BADAN RISET DAN PENGEMBANGAN SUMBER DAYA MANUSIA KELAUTAN DAN PERIKANAN',
          bold: true,
          size: 20,
          font: 'Arial',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'SEKOLAH USAHA PERIKANAN MENENGAH (SUPM) NEGERI TEGAL',
          bold: true,
          size: 24,
          font: 'Arial',
          color: '0B2545',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'Jl. Martoloyo No. 22 Tegal 52121 | Telp. (0283) 356246 | supmtegal.kkp.go.id',
          size: 16,
          font: 'Arial',
          color: '475569',
        }),
      ],
    }),
    new Paragraph({
      border: {
        bottom: {
          color: '0B2545',
          space: 4,
          style: BorderStyle.SINGLE,
          size: 16,
        },
      },
      children: [],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 150 },
      children: [
        new TextRun({
          text: `PERANGKAT ASESMEN ${meta.jenisAsesmen.toUpperCase()} - ${subTitle.toUpperCase()}`,
          bold: true,
          size: 24,
          font: 'Arial',
          color: '0F172A',
        }),
      ],
    }),
  ];
}

function createMetaTable(meta: AssessmentResult['metadata']): Table {
  const rows = [
    [
      { label: 'Satuan Pendidikan', value: 'SUPM NEGERI TEGAL' },
      { label: 'Kelas / Semester', value: `Kelas ${meta.kelas}` },
    ],
    [
      { label: 'Mata Pelajaran', value: meta.mataPelajaran },
      { label: 'Program Keahlian', value: `${meta.jurusan} (${meta.jurusanNamaLengkap})` },
    ],
    [
      { label: 'Guru Pengampu', value: meta.namaGuru || 'Guru Pengampu SUPM Tegal' },
      { label: 'Bentuk Instrumen', value: `${meta.bentukInstrumen} (${meta.jumlahSoal} Butir)` },
    ],
    [
      { label: 'Materi / Topik', value: meta.materiTopik },
      { label: 'Tingkat Kognitif', value: `Taksonomi SOLO (${meta.tingkatKognitifSolo})` },
    ],
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map(
      (pair) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: pair[0].label, bold: true, size: 18 })] })],
            }),
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: `: ${pair[0].value}`, size: 18 })] })],
            }),
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: pair[1].label, bold: true, size: 18 })] })],
            }),
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: `: ${pair[1].value}`, size: 18 })] })],
            }),
          ],
        })
    ),
  });
}

export async function generateDocxBlob(
  assessment: AssessmentResult,
  section: ExportSection = 'all'
): Promise<Blob> {
  const children: (Paragraph | Table)[] = [];
  const meta = assessment.metadata;

  const sectionTitles: Record<ExportSection, string> = {
    all: 'Paket Lengkap',
    kisi: 'Kisi-Kisi Soal',
    soal: 'Naskah Soal Peserta Didik',
    kunci: 'Kunci Jawaban & Pembahasan',
    rubrik: 'Rubrik & Pedoman Penskoran',
  };

  // Header & Meta
  children.push(...createHeaderParagraph(meta, sectionTitles[section]));
  children.push(createMetaTable(meta));
  children.push(new Paragraph({ spacing: { after: 200 }, children: [] }));

  // 1. KISI-KISI
  if (section === 'all' || section === 'kisi') {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: 'I. KISI-KISI PENULISAN SOAL / INSTRUMEN ASESMEN',
            bold: true,
            size: 20,
            color: '0B2545',
          }),
        ],
        spacing: { before: 200, after: 100 },
      })
    );

    const tableRows = [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 5, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'No', bold: true, size: 16 })] })],
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: 'Tujuan Pembelajaran', bold: true, size: 16 })] })],
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: 'Materi / Pokok Bahasan', bold: true, size: 16 })] })],
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: 'Indikator Soal / Tugas', bold: true, size: 16 })] })],
          }),
          new TableCell({
            width: { size: 12, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Level SOLO', bold: true, size: 16 })] })],
          }),
          new TableCell({
            width: { size: 8, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Bentuk', bold: true, size: 16 })] })],
          }),
          new TableCell({
            width: { size: 5, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'No.', bold: true, size: 16 })] })],
          }),
        ],
      }),
      ...assessment.kisiKisi.map(
        (k) =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(k.no), size: 16 })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: k.tujuanPembelajaran, size: 16 })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: k.materi, size: 16 })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: k.indikatorSoal, size: 16 })] })] }),
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: k.levelKognitifSolo, size: 16 })] })] }),
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: k.bentukInstrumen, size: 16 })] })] }),
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(k.nomorButir), size: 16 })] })] }),
            ],
          })
      ),
    ];

    children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: tableRows }));
    children.push(new Paragraph({ spacing: { after: 200 }, children: [] }));
  }

  // 2. NASKAH SOAL (STRICTLY NO KEYS)
  if (section === 'all' || section === 'soal') {
    if (section === 'all') {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }

    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: 'II. NASKAH SOAL ASESMEN (LEMBAR PESERTA DIDIK)',
            bold: true,
            size: 20,
            color: '0B2545',
          }),
        ],
        spacing: { before: 200, after: 100 },
      })
    );

    // Petunjuk umum
    if (assessment.petunjukUmum && assessment.petunjukUmum.length > 0) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: 'Petunjuk Umum Pengerjaan:', bold: true, size: 18 })],
          spacing: { after: 80 },
        })
      );
      assessment.petunjukUmum.forEach((p, idx) => {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `${idx + 1}. ${p}`, size: 18 })],
            indent: { left: 240 },
          })
        );
      });
      children.push(new Paragraph({ spacing: { after: 150 }, children: [] }));
    }

    // Butir-butir Soal
    assessment.naskahSoal.forEach((soal) => {
      if (soal.stimulus) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `[Stimulus Kasus Soal No. ${soal.no}] `,
                bold: true,
                italics: true,
                size: 18,
                color: '334155',
              }),
              new TextRun({ text: soal.stimulus, italics: true, size: 18 }),
            ],
            spacing: { before: 100, after: 60 },
          })
        );
      }

      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${soal.no}. `, bold: true, size: 19 }),
            new TextRun({ text: soal.pertanyaan, size: 19 }),
          ],
          spacing: { before: 80, after: 60 },
        })
      );

      // Opsi Pilihan Ganda A - E
      if (soal.opsi) {
        const ops = ['A', 'B', 'C', 'D', 'E'] as const;
        ops.forEach((optKey) => {
          if (soal.opsi && soal.opsi[optKey]) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: `${optKey}. `, bold: true, size: 18 }),
                  new TextRun({ text: soal.opsi[optKey], size: 18 }),
                ],
                indent: { left: 360 },
                spacing: { after: 40 },
              })
            );
          }
        });
      }

      if (soal.instruksiTugas) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Instruksi Tugas / Prosedur: ', bold: true, size: 18 }),
              new TextRun({ text: soal.instruksiTugas, size: 18 }),
            ],
            indent: { left: 240 },
            spacing: { after: 60 },
          })
        );
      }

      if (soal.kriteriaKinerja && soal.kriteriaKinerja.length > 0) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: 'Kriteria Kinerja yang Diamati:', bold: true, size: 18 })],
            indent: { left: 240 },
          })
        );
        soal.kriteriaKinerja.forEach((kk, ki) => {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: `- ${kk}`, size: 18 })],
              indent: { left: 400 },
            })
          );
        });
      }

      children.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
    });
  }

  // 3. KUNCI JAWABAN (SEPARATE SECTION)
  if (section === 'all' || section === 'kunci') {
    if (section === 'all') {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }

    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: 'III. KUNCI JAWABAN DAN PEMBAHASAN LENGKAP (DOKUMEN GURU)',
            bold: true,
            size: 20,
            color: '0B2545',
          }),
        ],
        spacing: { before: 200, after: 100 },
      })
    );

    assessment.kunciJawaban.forEach((kj) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Nomor ${kj.no} (${kj.bentuk}): `, bold: true, size: 19 }),
            new TextRun({ text: `Kunci: ${kj.kunci}`, bold: true, color: '1D4ED8', size: 19 }),
          ],
          spacing: { before: 100, after: 40 },
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Pembahasan & Analisis Ilmiah: ', bold: true, size: 18 }),
            new TextRun({ text: kj.pembahasan, size: 18 }),
          ],
          indent: { left: 240 },
          spacing: { after: 40 },
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Pedoman Penskoran: ', bold: true, size: 18, color: '047857' }),
            new TextRun({ text: kj.pedomanPemberianSkor, size: 18 }),
          ],
          indent: { left: 240 },
          spacing: { after: 120 },
        })
      );
    });
  }

  // 4. RUBRIK PENILAIAN
  if (section === 'all' || section === 'rubrik') {
    if (section === 'all') {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }

    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: 'IV. RUBRIK DAN PEDOMAN PENSKORAN KEJURUAN',
            bold: true,
            size: 20,
            color: '0B2545',
          }),
        ],
        spacing: { before: 200, after: 100 },
      })
    );

    const r = assessment.rubrikPenilaian;
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Aturan Penskoran: ', bold: true, size: 18 }),
          new TextRun({ text: r.aturanPenskoran, size: 18 }),
        ],
        spacing: { after: 80 },
      })
    );
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Rumus Nilai Akhir: ', bold: true, size: 18 }),
          new TextRun({ text: r.rumusNilaiAkhir, bold: true, color: '0B2545', size: 18 }),
        ],
        spacing: { after: 80 },
      })
    );
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Skor Total Maksimal: ', bold: true, size: 18 }),
          new TextRun({ text: `${r.skorTotalMaksimal} Poin`, size: 18 }),
        ],
        spacing: { after: 120 },
      })
    );

    // Kriteria rubrik table
    if (r.kriteria && r.kriteria.length > 0) {
      const critRows = [
        new TableRow({
          children: [
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'Aspek & Indikator', bold: true, size: 16 })] })] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'Sangat Baik (Skor 4)', bold: true, size: 16 })] })] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'Baik (Skor 3)', bold: true, size: 16 })] })] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'Cukup (Skor 2)', bold: true, size: 16 })] })] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'Perlu Bimbingan (Skor 1)', bold: true, size: 16 })] })] }),
          ],
        }),
        ...r.kriteria.map(
          (k) =>
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${k.aspek}\n(${k.indikator})`, bold: true, size: 16 })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: k.deskripsiKualitas.sangatBaik, size: 15 })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: k.deskripsiKualitas.baik, size: 15 })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: k.deskripsiKualitas.cukup, size: 15 })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: k.deskripsiKualitas.perluBimbingan, size: 15 })] })] }),
              ],
            })
        ),
      ];
      children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: critRows }));
      children.push(new Paragraph({ spacing: { after: 150 }, children: [] }));
    }

    if (r.tindakLanjutHasil) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: 'Rencana Tindak Lanjut Asesmen:', bold: true, size: 18 })],
          spacing: { after: 60 },
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Kriteria Ketuntasan: ', bold: true, size: 18 }),
            new TextRun({ text: r.tindakLanjutHasil.tuntasKriteria, size: 18 }),
          ],
          indent: { left: 240 },
          spacing: { after: 40 },
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Program Remedial / Pengayaan: ', bold: true, size: 18 }),
            new TextRun({ text: r.tindakLanjutHasil.remedialAtauPengayaan, size: 18 }),
          ],
          indent: { left: 240 },
          spacing: { after: 40 },
        })
      );
    }
  }

  // Tanda Tangan Guru & Pengesahan
  children.push(new Paragraph({ spacing: { before: 200 }, children: [] }));
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const signTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Mengetahui,\nKepala SUPM Negeri Tegal', size: 18 })] }),
              new Paragraph({ spacing: { before: 700 }, children: [new TextRun({ text: '_______________________________', bold: true, size: 18 })] }),
              new Paragraph({ children: [new TextRun({ text: 'NIP. .................................................', size: 16 })] }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({ children: [new TextRun({ text: `Tegal, ${today}\nGuru Mata Pelajaran`, size: 18 })] }),
              new Paragraph({ spacing: { before: 700 }, children: [new TextRun({ text: meta.namaGuru || '_______________________________', bold: true, size: 18 })] }),
              new Paragraph({ children: [new TextRun({ text: 'NIP. .................................................', size: 16 })] }),
            ],
          }),
        ],
      }),
    ],
  });
  children.push(signTable);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1200, bottom: 1200, left: 1200, right: 1200 },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}
