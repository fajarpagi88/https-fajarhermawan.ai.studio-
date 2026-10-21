import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AssessmentResult } from '../types/assessment';
import { ExportSection } from './docxExport';

export async function generatePdfBlob(
  assessment: AssessmentResult,
  section: ExportSection = 'all'
): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const meta = assessment.metadata;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const sectionTitles: Record<ExportSection, string> = {
    all: 'PAKET LENGKAP PERANGKAT ASESMEN',
    kisi: 'KISI-KISI PENULISAN SOAL / INSTRUMEN',
    soal: 'NASKAH SOAL ASESMEN (LEMBAR PESERTA DIDIK)',
    kunci: 'KUNCI JAWABAN & PEMBAHASAN LENGKAP',
    rubrik: 'RUBRIK DAN PEDOMAN PENSKORAN',
  };

  const drawKopSurat = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('KEMENTERIAN KELAUTAN DAN PERIKANAN', pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 4.5;

    doc.setFontSize(8.5);
    doc.text('BADAN PENYULUHAN DAN PENGEMBANGAN SDM KELAUTAN DAN PERIKANAN', pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 4.5;

    doc.setFontSize(11);
    doc.setTextColor(11, 37, 69);
    doc.text('SEKOLAH USAHA PERIKANAN MENENGAH (SUPM) NEGERI TEGAL', pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text('Jl. Martoloyo No. 22 Tegal 52121 | Telp. (0283) 356246 | supmtegal.kkp.go.id', pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 2.5;

    // Garis Kop Ganda
    doc.setDrawColor(11, 37, 69);
    doc.setLineWidth(0.8);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 0.8;
    doc.setLineWidth(0.3);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 5;

    // Subtitle
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`PERANGKAT ASESMEN ${meta.jenisAsesmen.toUpperCase()} - ${sectionTitles[section]}`, pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 5;
  };

  const drawMetaBox = () => {
    autoTable(doc, {
      startY: cursorY,
      theme: 'plain',
      styles: { fontSize: 8, cellPadding: 1, textColor: [30, 41, 59] },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 26 },
        1: { cellWidth: 55 },
        2: { fontStyle: 'bold', cellWidth: 28 },
        3: { cellWidth: 60 },
      },
      body: [
        ['Satuan Pendidikan', `: SUPM NEGERI TEGAL`, 'Tingkat / Kelas', `: Kelas ${meta.kelas} (SMK)`],
        ['Mata Pelajaran', `: ${meta.mataPelajaran}`, 'Program Keahlian', `: ${meta.jurusan} - ${meta.jurusanNamaLengkap}`],
        ['Guru Pengampu', `: ${meta.namaGuru || 'Guru Pengampu'}`, 'Bentuk Instrumen', `: ${meta.bentukInstrumen} (${meta.jumlahSoal} Butir)`],
        ['Materi / Topik', `: ${meta.materiTopik}`, 'Tingkat Kognitif', `: Taksonomi SOLO (${meta.tingkatKognitifSolo})`],
      ],
      margin: { left: margin, right: margin },
    });
    cursorY = (doc as any).lastAutoTable.finalY + 4;
  };

  drawKopSurat();
  drawMetaBox();

  // 1. KISI-KISI
  if (section === 'all' || section === 'kisi') {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(11, 37, 69);
    doc.text('I. KISI-KISI PENULISAN SOAL / INSTRUMEN ASESMEN', margin, cursorY);
    cursorY += 3;

    autoTable(doc, {
      startY: cursorY,
      theme: 'grid',
      headStyles: { fillColor: [11, 37, 69], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5, halign: 'center' },
      styles: { fontSize: 7, cellPadding: 1.5, overflow: 'linebreak' },
      columnStyles: {
        0: { halign: 'center', cellWidth: 8 },
        1: { cellWidth: 42 },
        2: { cellWidth: 32 },
        3: { cellWidth: 45 },
        4: { halign: 'center', cellWidth: 22 },
        5: { halign: 'center', cellWidth: 23 },
        6: { halign: 'center', cellWidth: 10 },
      },
      head: [['No', 'Tujuan Pembelajaran', 'Materi', 'Indikator Soal / Tugas', 'Level SOLO', 'Bentuk', 'Butir']],
      body: assessment.kisiKisi.map((k) => [
        k.no,
        k.tujuanPembelajaran,
        k.materi,
        k.indikatorSoal,
        k.levelKognitifSolo,
        k.bentukInstrumen,
        k.nomorButir,
      ]),
      margin: { left: margin, right: margin },
    });

    cursorY = (doc as any).lastAutoTable.finalY + 6;
  }

  // 2. NASKAH SOAL (STRICTLY NO KEYS)
  if (section === 'all' || section === 'soal') {
    if (section === 'all') {
      doc.addPage();
      cursorY = margin;
      drawKopSurat();
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(11, 37, 69);
    doc.text('II. NASKAH SOAL ASESMEN (LEMBAR PESERTA DIDIK)', margin, cursorY);
    cursorY += 4;

    if (assessment.petunjukUmum && assessment.petunjukUmum.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text('Petunjuk Pengerjaan:', margin, cursorY);
      cursorY += 3.5;

      doc.setFont('helvetica', 'normal');
      assessment.petunjukUmum.forEach((p, idx) => {
        doc.text(`${idx + 1}. ${p}`, margin + 3, cursorY);
        cursorY += 3.2;
      });
      cursorY += 2;
    }

    // Iterate questions
    assessment.naskahSoal.forEach((soal) => {
      // Check page break needed
      if (cursorY > pageHeight - 35) {
        doc.addPage();
        cursorY = margin;
      }

      if (soal.stimulus) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        const stimLines = doc.splitTextToSize(`[Stimulus No. ${soal.no}] ${soal.stimulus}`, contentWidth - 4);
        doc.text(stimLines, margin + 2, cursorY);
        cursorY += stimLines.length * 3.2 + 1.5;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${soal.no}.`, margin, cursorY);

      doc.setFont('helvetica', 'normal');
      const qLines = doc.splitTextToSize(soal.pertanyaan, contentWidth - 8);
      doc.text(qLines, margin + 6, cursorY);
      cursorY += qLines.length * 3.5 + 2;

      // Opsi Pilihan Ganda A - E
      if (soal.opsi) {
        const ops = ['A', 'B', 'C', 'D', 'E'] as const;
        ops.forEach((optKey) => {
          if (soal.opsi && soal.opsi[optKey]) {
            if (cursorY > pageHeight - 15) {
              doc.addPage();
              cursorY = margin;
            }
            doc.setFont('helvetica', 'bold');
            doc.text(`${optKey}.`, margin + 6, cursorY);
            doc.setFont('helvetica', 'normal');
            const optLines = doc.splitTextToSize(soal.opsi[optKey], contentWidth - 14);
            doc.text(optLines, margin + 11, cursorY);
            cursorY += optLines.length * 3.3 + 1;
          }
        });
      }

      if (soal.instruksiTugas) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.5);
        doc.setTextColor(51, 65, 85);
        const insLines = doc.splitTextToSize(`Instruksi: ${soal.instruksiTugas}`, contentWidth - 8);
        doc.text(insLines, margin + 6, cursorY);
        cursorY += insLines.length * 3.2 + 1;
      }

      cursorY += 3;
    });
  }

  // 3. KUNCI JAWABAN (SEPARATE PAGE & SECTION)
  if (section === 'all' || section === 'kunci') {
    if (section === 'all') {
      doc.addPage();
      cursorY = margin;
      drawKopSurat();
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(11, 37, 69);
    doc.text('III. KUNCI JAWABAN & PEMBAHASAN LENGKAP (DOKUMEN GURU)', margin, cursorY);
    cursorY += 4;

    assessment.kunciJawaban.forEach((kj) => {
      if (cursorY > pageHeight - 30) {
        doc.addPage();
        cursorY = margin;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(29, 78, 216);
      doc.text(`Nomor ${kj.no} (${kj.bentuk}) - Kunci: ${kj.kunci}`, margin, cursorY);
      cursorY += 3.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
      const pembLines = doc.splitTextToSize(`Pembahasan: ${kj.pembahasan}`, contentWidth - 4);
      doc.text(pembLines, margin + 2, cursorY);
      cursorY += pembLines.length * 3.2 + 1;

      doc.setFont('helvetica', 'italic');
      doc.setTextColor(5, 150, 105);
      const skorLines = doc.splitTextToSize(`Pedoman Skor: ${kj.pedomanPemberianSkor}`, contentWidth - 4);
      doc.text(skorLines, margin + 2, cursorY);
      cursorY += skorLines.length * 3.2 + 3;
    });
  }

  // 4. RUBRIK PENILAIAN
  if (section === 'all' || section === 'rubrik') {
    if (section === 'all') {
      doc.addPage();
      cursorY = margin;
      drawKopSurat();
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(11, 37, 69);
    doc.text('IV. RUBRIK DAN PEDOMAN PENSKORAN KEJURUAN', margin, cursorY);
    cursorY += 3.5;

    const r = assessment.rubrikPenilaian;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(`Aturan Penskoran: ${r.aturanPenskoran}`, margin, cursorY);
    cursorY += 3.8;
    doc.text(`Rumus Nilai Akhir: ${r.rumusNilaiAkhir}`, margin, cursorY);
    cursorY += 3.8;
    doc.text(`Skor Total Maksimal: ${r.skorTotalMaksimal} Poin`, margin, cursorY);
    cursorY += 4;

    if (r.kriteria && r.kriteria.length > 0) {
      autoTable(doc, {
        startY: cursorY,
        theme: 'grid',
        headStyles: { fillColor: [11, 37, 69], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7, halign: 'center' },
        styles: { fontSize: 6.5, cellPadding: 1.5, overflow: 'linebreak' },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 32 },
          1: { cellWidth: 37 },
          2: { cellWidth: 37 },
          3: { cellWidth: 37 },
          4: { cellWidth: 37 },
        },
        head: [['Aspek & Indikator', 'Sangat Baik (4)', 'Baik (3)', 'Cukup (2)', 'Perlu Bimbingan (1)']],
        body: r.kriteria.map((k) => [
          `${k.aspek}\n${k.indikator}`,
          k.deskripsiKualitas.sangatBaik,
          k.deskripsiKualitas.baik,
          k.deskripsiKualitas.cukup,
          k.deskripsiKualitas.perluBimbingan,
        ]),
        margin: { left: margin, right: margin },
      });
      cursorY = (doc as any).lastAutoTable.finalY + 6;
    }
  }

  // Tanda Tangan
  if (cursorY > pageHeight - 35) {
    doc.addPage();
    cursorY = margin;
  }
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);

  doc.text('Mengetahui,\nKepala SUPM Negeri Tegal', margin + 10, cursorY);
  doc.text(`Tegal, ${today}\nGuru Mata Pelajaran`, pageWidth - margin - 50, cursorY);
  cursorY += 18;
  doc.setFont('helvetica', 'bold');
  doc.text('___________________________', margin + 10, cursorY);
  doc.text(meta.namaGuru || '___________________________', pageWidth - margin - 50, cursorY);
  cursorY += 3.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('NIP. .................................................', margin + 10, cursorY);
  doc.text('NIP. .................................................', pageWidth - margin - 50, cursorY);

  // Penomoran Halaman di Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `SUPM Tegal Assessment Generator | Halaman ${i} dari ${totalPages}`,
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  }

  return doc.output('blob');
}
