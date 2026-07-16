import {
  Document,
  Packer,
  Table,
  TableRow,
  TableCell,
  Paragraph,
  TextRun,
  BorderStyle,
  AlignmentType,
  WidthType,
  LineRuleType,
} from "docx";
import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

/**
 * Creates a standard styled text paragraph.
 */
export function createParagraph(text: string, opts: {
  bold?: boolean;
  italic?: boolean;
  size?: number; // half-points, e.g., 22 = 11pt
  alignment?: any;
  color?: string;
  beforeSpace?: number;
  afterSpace?: number;
  lineSpacing?: number;
} = {}): Paragraph {
  let size = opts.size;
  if (size === 18 || size === 20 || size === undefined) {
    size = 22;
  } else if (size === 1) {
    size = 1; // Preserve special hidden marker size
  }
  return new Paragraph({
    alignment: opts.alignment,
    spacing: {
      before: opts.beforeSpace,
      after: opts.afterSpace,
      line: opts.lineSpacing !== undefined ? opts.lineSpacing : 276,                 // 1.15x line spacing — mencegah teks multi-baris dempet
      lineRule: LineRuleType.AUTO,
    },
    children: [
      new TextRun({
        text,
        bold: opts.bold,
        italics: opts.italic,
        size: size,
        color: opts.color,
      }),
    ],
  });
}

/**
 * Generates border configuration with no borders.
 */
export function getNoBorders() {
  return {
    top: { style: BorderStyle.NONE, size: 0, color: "auto" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
    left: { style: BorderStyle.NONE, size: 0, color: "auto" },
    right: { style: BorderStyle.NONE, size: 0, color: "auto" },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
    insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
  };
}

/**
 * Creates a table header cell styled with a nice light-gray background and centered bold text.
 */
export function createHeaderCell(text: string, fontSize: number = 22): TableCell {
  let size = fontSize;
  if (size === 18 || size === 20) {
    size = 22;
  }
  return new TableCell({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: 276, lineRule: LineRuleType.AUTO },
        children: [
          new TextRun({
            text,
            bold: true,
            size: size,
          }),
        ],
      }),
    ],
    shading: { fill: "E6E6E6" },
    margins: { top: 120, bottom: 120, left: 150, right: 150 },
  });
}

/**
 * Creates a styled standard cell for the grid.
 */
export function createCell(text: string, opts: {
  bold?: boolean;
  italic?: boolean;
  align?: any;
  fontSize?: number;
} = {}): TableCell {
  let size = opts.fontSize || 22;
  if (size === 18 || size === 20) {
    size = 22;
  }
  return new TableCell({
    children: [
      new Paragraph({
        alignment: opts.align || AlignmentType.LEFT,
        spacing: { line: 276, lineRule: LineRuleType.AUTO },
        children: [
          new TextRun({
            text: text || "",
            bold: opts.bold,
            italics: opts.italic,
            size: size,
          }),
        ],
      }),
    ],
    margins: { top: 120, bottom: 120, left: 150, right: 150 },
  });
}

// =========================================================================
// PREMIUM TEMPLATE DESIGN UTILITIES & HELPERS
// =========================================================================

export function getLightBorders() {
  return {
    top: { style: BorderStyle.SINGLE, size: 4, color: "FFFFFF" },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: "FFFFFF" },
    left: { style: BorderStyle.SINGLE, size: 4, color: "FFFFFF" },
    right: { style: BorderStyle.SINGLE, size: 4, color: "FFFFFF" },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "FFFFFF" },
    insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "FFFFFF" },
  };
}

export function createPremiumHeaderCell(text: string, bgColor: string = "1D4ED8", textColor: string = "FFFFFF"): TableCell {
  return new TableCell({
    shading: { fill: bgColor },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 140, after: 140, line: 276, lineRule: LineRuleType.AUTO },
        children: [
          new TextRun({
            text,
            bold: true,
            size: 22,
            color: textColor,
          }),
        ],
      }),
    ],
    margins: { top: 160, bottom: 160, left: 200, right: 200 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: "CBD5E1" },
      bottom: { style: BorderStyle.SINGLE, size: 10, color: "94A3B8" },
      left: { style: BorderStyle.SINGLE, size: 6, color: "CBD5E1" },
      right: { style: BorderStyle.SINGLE, size: 6, color: "CBD5E1" },
    },
  });
}

export function createPremiumCell(text: string, opts: {
  bold?: boolean;
  italic?: boolean;
  align?: any;
  fontSize?: number;
  bgColor?: string;
  textColor?: string;
} = {}): TableCell {
  let size = opts.fontSize || 22;
  if (size === 18 || size === 20) {
    size = 22;
  }
  return new TableCell({
    shading: opts.bgColor ? { fill: opts.bgColor } : undefined,
    children: [
      new Paragraph({
        alignment: opts.align || AlignmentType.LEFT,
        spacing: { before: 120, after: 120, line: 276, lineRule: LineRuleType.AUTO },
        children: [
          new TextRun({
            text: text || "",
            bold: opts.bold,
            italics: opts.italic,
            size: size,
            color: opts.textColor,
          }),
        ],
      }),
    ],
    margins: { top: 160, bottom: 160, left: 200, right: 200 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
    },
  });
}

function createDocumentHeader(docTitle: string): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { line: 276, lineRule: LineRuleType.AUTO },
                children: [
                  new TextRun({
                    text: "{schoolName}",
                    bold: true,
                    size: 22,
                    color: "1D4ED8",
                  }),
                ],
              }),
            ],
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: "auto" },
              left: { style: BorderStyle.NONE, size: 0, color: "auto" },
              right: { style: BorderStyle.NONE, size: 0, color: "auto" },
              bottom: { style: BorderStyle.SINGLE, size: 12, color: "1D4ED8" },
            },
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { line: 276, lineRule: LineRuleType.AUTO },
                children: [
                  new TextRun({
                    text: ` | ${docTitle}`,
                    size: 22,
                    color: "64748B",
                  }),
                ],
              }),
            ],
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: "auto" },
              left: { style: BorderStyle.NONE, size: 0, color: "auto" },
              right: { style: BorderStyle.NONE, size: 0, color: "auto" },
              bottom: { style: BorderStyle.SINGLE, size: 12, color: "1D4ED8" },
            },
          }),
        ],
      }),
    ],
  });
}

function createDesignBar(text: string): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                spacing: { before: 80, after: 80, line: 276, lineRule: LineRuleType.AUTO },
                children: [
                  new TextRun({
                    text: `  ${text}`,
                    bold: true,
                    size: 22,
                    color: "1E293B",
                  }),
                ],
              }),
            ],
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: "auto" },
              bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
              right: { style: BorderStyle.NONE, size: 0, color: "auto" },
              left: { style: BorderStyle.SINGLE, size: 24, color: "1D4ED8" },
            },
          }),
        ],
      }),
    ],
    borders: getNoBorders(),
  });
}

function createCustomIdentityTable(): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: { fill: "F8FAFC" },
            children: [createParagraph("Satuan Pendidikan", { bold: true, size: 20, color: "334155", lineSpacing: 300, beforeSpace: 80, afterSpace: 80 })],
            borders: getLightBorders(),
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            children: [createParagraph("{schoolName}", { size: 20, lineSpacing: 300, beforeSpace: 80, afterSpace: 80 })],
            borders: getLightBorders(),
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: { fill: "F8FAFC" },
            children: [createParagraph("Tahun Pelajaran", { bold: true, size: 20, color: "334155", lineSpacing: 300, beforeSpace: 80, afterSpace: 80 })],
            borders: getLightBorders(),
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            children: [createParagraph("{academicYear}", { size: 20, lineSpacing: 300, beforeSpace: 80, afterSpace: 80 })],
            borders: getLightBorders(),
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: { fill: "F8FAFC" },
            children: [createParagraph("Nama Penyusun", { bold: true, size: 20, color: "334155", lineSpacing: 300, beforeSpace: 80, afterSpace: 80 })],
            borders: getLightBorders(),
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            children: [createParagraph("{author}", { size: 20, lineSpacing: 300, beforeSpace: 80, afterSpace: 80 })],
            borders: getLightBorders(),
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: { fill: "F8FAFC" },
            children: [createParagraph("NIP", { bold: true, size: 20, color: "334155", lineSpacing: 300, beforeSpace: 80, afterSpace: 80 })],
            borders: getLightBorders(),
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            children: [createParagraph("{nip}", { size: 20, lineSpacing: 300, beforeSpace: 80, afterSpace: 80 })],
            borders: getLightBorders(),
          }),
        ],
      }),
    ],
  });
}

function createCustomSignaturesTable(): Table {
  const whiteBorders = {
    top: { style: BorderStyle.SINGLE, size: 4, color: "FFFFFF" },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: "FFFFFF" },
    left: { style: BorderStyle.SINGLE, size: 4, color: "FFFFFF" },
    right: { style: BorderStyle.SINGLE, size: 4, color: "FFFFFF" },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "FFFFFF" },
    insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "FFFFFF" },
  };

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: whiteBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              createParagraph("Mengetahui,", { size: 22, alignment: AlignmentType.CENTER }),
              createParagraph("Kepala Sekolah", { size: 22, afterSpace: 1200, alignment: AlignmentType.CENTER }),
              createParagraph("{namaKepalaSekolah}", { bold: true, size: 22, alignment: AlignmentType.CENTER }),
              createParagraph("NIP. {nipKepalaSekolah}", { size: 22, alignment: AlignmentType.CENTER }),
            ],
            borders: whiteBorders,
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              createParagraph("{schoolAddressFirst}, {currentDate}", { size: 22, alignment: AlignmentType.CENTER }),
              createParagraph("Guru {subject}", { size: 22, afterSpace: 1200, alignment: AlignmentType.CENTER }),
              createParagraph("{author}", { bold: true, size: 22, alignment: AlignmentType.CENTER }),
              createParagraph("NIP. {nip}", { size: 22, alignment: AlignmentType.CENTER }),
            ],
            borders: whiteBorders,
          }),
        ],
      }),
    ],
  });
}

function buildCpTemplate(): Document {
  const children = [
    createDocumentHeader("Capaian Pembelajaran"),
    createParagraph("", { afterSpace: 200 }),
    createParagraph("CAPAIAN PEMBELAJARAN (CP)", { bold: true, size: 30, alignment: AlignmentType.CENTER, beforeSpace: 200, afterSpace: 50, color: "1E293B" }),
    createParagraph("{subject_upper} — FASE {phase}", { bold: true, size: 22, alignment: AlignmentType.CENTER, afterSpace: 400, color: "1D4ED8" }),
    createCustomIdentityTable(),
    createParagraph("", { afterSpace: 400 }),
    createDesignBar("Capaian Pembelajaran per Elemen"),
    createParagraph("", { afterSpace: 200 }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            createPremiumHeaderCell("Elemen", "1D4ED8"),
            createPremiumHeaderCell("Deskripsi Capaian Pembelajaran (CP) Resmi", "1D4ED8"),
          ],
        }),
        new TableRow({
          children: [
            createPremiumCell("{#elements}{name}", { bold: true }),
            createPremiumCell("{cpText}{/elements}"),
          ],
        }),
      ],
    }),
    createParagraph("", { afterSpace: 600 }),
    createCustomSignaturesTable()
  ];
  return new Document({ sections: [{ properties: { page: { size: { orientation: "landscape" } } }, children }] });
}

function buildTpTemplate(): Document {
  const children = [
    createDocumentHeader("Tujuan Pembelajaran"),
    createParagraph("", { afterSpace: 200 }),
    createParagraph("TUJUAN PEMBELAJARAN (TP)", { bold: true, size: 30, alignment: AlignmentType.CENTER, beforeSpace: 200, afterSpace: 50, color: "1E293B" }),
    createParagraph("{subject_upper} — FASE {phase} — KELAS {classStr}", { bold: true, size: 22, alignment: AlignmentType.CENTER, afterSpace: 400, color: "1D4ED8" }),
    createCustomIdentityTable(),
    createParagraph("", { afterSpace: 400 }),
    
    createParagraph("{#gradesList}", { size: 1 }),
    createParagraph("KELAS {grade}", { bold: true, size: 20, color: "1D4ED8", beforeSpace: 200, afterSpace: 100 }),
    createDesignBar("Rumusan Tujuan Pembelajaran Kelas {grade}"),
    createParagraph("", { afterSpace: 200 }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            createPremiumHeaderCell("Kode", "1D4ED8"),
            createPremiumHeaderCell("Elemen", "1D4ED8"),
            createPremiumHeaderCell("Kompetensi / KKO", "1D4ED8"),
            createPremiumHeaderCell("Materi / Konten", "1D4ED8"),
            createPremiumHeaderCell("Rumusan Lengkap Tujuan Pembelajaran (TP)", "1D4ED8"),
          ],
        }),
        new TableRow({
          children: [
            createPremiumCell("{#tps}{code}", { bold: true, align: AlignmentType.CENTER }),
            createPremiumCell("{element}"),
            createPremiumCell("{competency}"),
            createPremiumCell("{content}"),
            createPremiumCell("{text}{/tps}"),
          ],
        }),
      ],
    }),
    createParagraph("", { afterSpace: 600 }),
    createParagraph("{/gradesList}", { size: 1 }),
    
    createCustomSignaturesTable()
  ];
  return new Document({ sections: [{ properties: { page: { size: { orientation: "landscape" } } }, children }] });
}

function buildAtpTemplate(): Document {
  const children = [
    createDocumentHeader("Alur Tujuan Pembelajaran"),
    createParagraph("", { afterSpace: 200 }),
    createParagraph("ALUR DAN TUJUAN PEMBELAJARAN (ATP)", { bold: true, size: 30, alignment: AlignmentType.CENTER, beforeSpace: 200, afterSpace: 50, color: "1E293B" }),
    createParagraph("{subject_upper} — FASE {phase} — KELAS {classStr}", { bold: true, size: 22, alignment: AlignmentType.CENTER, afterSpace: 400, color: "1D4ED8" }),
    createCustomIdentityTable(),
    createParagraph("", { afterSpace: 400 }),
    
    createParagraph("{#gradesList}", { size: 1 }),
    createParagraph("KELAS {grade}", { bold: true, size: 20, color: "1D4ED8", beforeSpace: 200, afterSpace: 100 }),
    createDesignBar("Alur Tujuan Pembelajaran (Sequencing) Kelas {grade}"),
    createParagraph("", { afterSpace: 200 }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            createPremiumHeaderCell("No", "1D4ED8"),
            createPremiumHeaderCell("Bab / Topik", "1D4ED8"),
            createPremiumHeaderCell("Tujuan Pembelajaran", "1D4ED8"),
            createPremiumHeaderCell("Kode Aktivitas", "1D4ED8"),
            createPremiumHeaderCell("Alokasi JP", "1D4ED8"),
          ],
        }),
        new TableRow({
          children: [
            createPremiumCell("{#tps}{no}", { align: AlignmentType.CENTER }),
            createPremiumCell("{materiPokok}", { bold: true }),
            createPremiumCell("{text}"),
            createPremiumCell("{code}", { align: AlignmentType.CENTER }),
            createPremiumCell("{jp} JP{/tps}", { align: AlignmentType.CENTER }),
          ],
        }),
      ],
    }),
    createParagraph("", { afterSpace: 600 }),
    createParagraph("{/gradesList}", { size: 1 }),
    
    createCustomSignaturesTable()
  ];
  return new Document({ sections: [{ properties: { page: { size: { orientation: "landscape" } } }, children }] });
}

function buildProtaTemplate(): Document {
  const children = [
    createDocumentHeader("Program Tahunan"),
    createParagraph("", { afterSpace: 200 }),
    createParagraph("PROGRAM TAHUNAN (PROTA)", { bold: true, size: 30, alignment: AlignmentType.CENTER, beforeSpace: 200, afterSpace: 50, color: "1E293B" }),
    createParagraph("{subject_upper} — FASE {phase} — KELAS {classStr}", { bold: true, size: 22, alignment: AlignmentType.CENTER, afterSpace: 400, color: "1D4ED8" }),
    createCustomIdentityTable(),
    createParagraph("", { afterSpace: 400 }),
    
    createParagraph("{#gradesList}", { size: 1 }),
    createParagraph("KELAS {grade}", { bold: true, size: 20, color: "1D4ED8", beforeSpace: 200, afterSpace: 100 }),
    createDesignBar("Distribusi Materi dan Alokasi Waktu Kelas {grade}"),
    createParagraph("", { afterSpace: 200 }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            createPremiumHeaderCell("Smt", "1D4ED8"),
            createPremiumHeaderCell("Kode Bab", "1D4ED8"),
            createPremiumHeaderCell("Cakupan Materi Pembelajaran / Bab", "1D4ED8"),
            createPremiumHeaderCell("Alokasi Waktu", "1D4ED8"),
          ],
        }),
        new TableRow({
          children: [
            createPremiumCell("Semester {semesterStr}", { align: AlignmentType.CENTER }),
            createPremiumCell("{#babs}{code}", { bold: true, align: AlignmentType.CENTER }),
            createPremiumCell("{name}"),
            createPremiumCell("{jpEstimation} JP{/babs}", { align: AlignmentType.CENTER }),
          ],
        }),
      ],
    }),
    createParagraph("", { afterSpace: 600 }),
    createParagraph("{/gradesList}", { size: 1 }),
    
    createCustomSignaturesTable()
  ];
  return new Document({ sections: [{ properties: { page: { size: { orientation: "landscape" } } }, children }] });
}

function buildPromesTemplate(): Document {
  const children = [
    createDocumentHeader("Program Semester"),
    createParagraph("", { afterSpace: 200 }),
    createParagraph("PROGRAM SEMESTER (PROMES)", { bold: true, size: 30, alignment: AlignmentType.CENTER, beforeSpace: 200, afterSpace: 50, color: "1E293B" }),
    createParagraph("{subject_upper} — FASE {phase} — SEMESTER I & II", { bold: true, size: 22, alignment: AlignmentType.CENTER, afterSpace: 400, color: "1D4ED8" }),
    createCustomIdentityTable(),
    createParagraph("", { afterSpace: 400 }),
    
    createParagraph("{#gradesList}", { size: 1 }),
    createParagraph("KELAS {grade}", { bold: true, size: 20, color: "1D4ED8", beforeSpace: 200, afterSpace: 100 }),
    createDesignBar("Cakupan Jadwal Pelaksanaan Mingguan Kelas {grade}"),
    createParagraph("", { afterSpace: 200 }),

    // Block 1: Semester I (Ganjil)
    createParagraph("SEMESTER I (GANJIL)", { bold: true, size: 16, color: "1D4ED8", beforeSpace: 200, afterSpace: 100 }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            createPremiumHeaderCell("Kode TP", "1D4ED8"),
            createPremiumHeaderCell("Tujuan Pembelajaran / Fokus Indikator", "1D4ED8"),
            createPremiumHeaderCell("JP", "1D4ED8"),
            createPremiumHeaderCell("M1", "1D4ED8"),
            createPremiumHeaderCell("M2", "1D4ED8"),
            createPremiumHeaderCell("M3", "1D4ED8"),
            createPremiumHeaderCell("M4", "1D4ED8"),
            createPremiumHeaderCell("Bulan Blok", "1D4ED8"),
          ],
        }),
        new TableRow({
          children: [
            createPremiumCell("{#s1Tps}{code}", { bold: true, align: AlignmentType.CENTER }),
            createPremiumCell("{text}"),
            createPremiumCell("{jp}", { align: AlignmentType.CENTER }),
            createPremiumCell("{m1}", { align: AlignmentType.CENTER }),
            createPremiumCell("{m2}", { align: AlignmentType.CENTER }),
            createPremiumCell("{m3}", { align: AlignmentType.CENTER }),
            createPremiumCell("{m4}", { align: AlignmentType.CENTER }),
            createPremiumCell("{bulan}{/s1Tps}", { align: AlignmentType.CENTER }),
          ],
        }),
      ],
    }),
    createParagraph("", { afterSpace: 400 }),

    // Block 2: Semester II (Genap)
    createParagraph("SEMESTER II (GENAP)", { bold: true, size: 16, color: "1D4ED8", beforeSpace: 200, afterSpace: 100 }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            createPremiumHeaderCell("Kode TP", "1D4ED8"),
            createPremiumHeaderCell("Tujuan Pembelajaran / Fokus Indikator", "1D4ED8"),
            createPremiumHeaderCell("JP", "1D4ED8"),
            createPremiumHeaderCell("M1", "1D4ED8"),
            createPremiumHeaderCell("M2", "1D4ED8"),
            createPremiumHeaderCell("M3", "1D4ED8"),
            createPremiumHeaderCell("M4", "1D4ED8"),
            createPremiumHeaderCell("Bulan Blok", "1D4ED8"),
          ],
        }),
        new TableRow({
          children: [
            createPremiumCell("{#s2Tps}{code}", { bold: true, align: AlignmentType.CENTER }),
            createPremiumCell("{text}"),
            createPremiumCell("{jp}", { align: AlignmentType.CENTER }),
            createPremiumCell("{m1}", { align: AlignmentType.CENTER }),
            createPremiumCell("{m2}", { align: AlignmentType.CENTER }),
            createPremiumCell("{m3}", { align: AlignmentType.CENTER }),
            createPremiumCell("{m4}", { align: AlignmentType.CENTER }),
            createPremiumCell("{bulan}{/s2Tps}", { align: AlignmentType.CENTER }),
          ],
        }),
      ],
    }),

    createParagraph("", { afterSpace: 600 }),
    createParagraph("{/gradesList}", { size: 1 }),
    
    createCustomSignaturesTable()
  ];
  return new Document({ sections: [{ properties: { page: { size: { orientation: "landscape" } } }, children }] });
}

function buildKktpTemplate(kktpOption: string = "A"): Document {
  let tableHeaderRow: TableRow;
  let tableDataRow: TableRow;
  let titleBarText = "Rubrik Ketercapaian (per Tujuan Pembelajaran) Kelas {grade}";
  let noteText = "Catatan: Peserta didik dianggap mencapai tujuan pembelajaran apabila berada minimal pada level \"Baik\".";

  if (kktpOption === "A") {
    titleBarText = "Deskripsi Kriteria Ketercapaian (per Tujuan Pembelajaran) Kelas {grade}";
    noteText = "Catatan: Peserta didik dianggap mencapai tujuan pembelajaran jika kriteria penilaian berada pada kategori \"Memadai\".";
    tableHeaderRow = new TableRow({
      tableHeader: true,
      children: [
        createPremiumHeaderCell("Tujuan Pembelajaran / Indikator", "1D4ED8"),
        createPremiumHeaderCell("Tidak Memadai", "DC2626"),
        createPremiumHeaderCell("Memadai", "16A34A"),
        createPremiumHeaderCell("Keterangan & Rencana Tindak Lanjut", "2563EB"),
      ],
    });
    tableDataRow = new TableRow({
      children: [
        createPremiumCell("{#tps}{text}", { bold: true }),
        createPremiumCell("Belum Muncul (Belum Tuntas)", { bgColor: "FEF2F2", textColor: "991B1B" }),
        createPremiumCell("Sudah Muncul (Tuntas)", { bgColor: "F0FDF4", textColor: "166534" }),
        createPremiumCell("Bila belum memadai, lakukan intervensi terbimbing; bila sudah, berikan pengayaan.{/tps}", { textColor: "475569" }),
      ],
    });
  } else if (kktpOption === "C") {
    titleBarText = "Interval Nilai Ketercapaian (per Tujuan Pembelajaran) Kelas {grade}";
    noteText = "Catatan: Peserta didik dianggap mencapai tujuan pembelajaran apabila memperoleh nilai minimal pada interval 61-80% (Baik).";
    tableHeaderRow = new TableRow({
      tableHeader: true,
      children: [
        createPremiumHeaderCell("Tujuan Pembelajaran / Indikator", "1D4ED8"),
        createPremiumHeaderCell("0-40% (Perlu Bimbingan)", "DC2626"),
        createPremiumHeaderCell("41-60% (Cukup)", "D97706"),
        createPremiumHeaderCell("61-80% (Baik)", "2563EB"),
        createPremiumHeaderCell("81-100% (Sangat Baik)", "16A34A"),
      ],
    });
    tableDataRow = new TableRow({
      children: [
        createPremiumCell("{#tps}{text}", { bold: true }),
        createPremiumCell("{interval1}", { bgColor: "FEF2F2", textColor: "991B1B" }),
        createPremiumCell("{interval2}", { bgColor: "FFFBEB", textColor: "92400E" }),
        createPremiumCell("{interval3}", { bgColor: "EFF6FF", textColor: "1E40AF" }),
        createPremiumCell("{interval4}{/tps}", { bgColor: "F0FDF4", textColor: "166534" }),
      ],
    });
  } else {
    // Opsi B / Default Rubrik
    titleBarText = "Rubrik Ketercapaian (per Tujuan Pembelajaran) Kelas {grade}";
    noteText = "Catatan: Peserta didik dianggap mencapai tujuan pembelajaran apabila berada minimal pada level \"Cakap\" atau \"Baik\".";
    tableHeaderRow = new TableRow({
      tableHeader: true,
      children: [
        createPremiumHeaderCell("Tujuan Pembelajaran / Indikator", "1D4ED8"),
        createPremiumHeaderCell("Baru Berkembang", "DC2626"),
        createPremiumHeaderCell("Layak", "D97706"),
        createPremiumHeaderCell("Cakap", "2563EB"),
        createPremiumHeaderCell("Mahir", "16A34A"),
      ],
    });
    tableDataRow = new TableRow({
      children: [
        createPremiumCell("{#tps}{text}", { bold: true }),
        createPremiumCell("{interval1}", { bgColor: "FEF2F2", textColor: "991B1B" }),
        createPremiumCell("{interval2}", { bgColor: "FFFBEB", textColor: "92400E" }),
        createPremiumCell("{interval3}", { bgColor: "EFF6FF", textColor: "1E40AF" }),
        createPremiumCell("{interval4}{/tps}", { bgColor: "F0FDF4", textColor: "166534" }),
      ],
    });
  }

  const children = [
    createDocumentHeader("Kriteria Ketercapaian Tujuan Pembelajaran"),
    createParagraph("", { afterSpace: 200 }),
    createParagraph("KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP)", { bold: true, size: 30, alignment: AlignmentType.CENTER, beforeSpace: 200, afterSpace: 50, color: "1E293B" }),
    createParagraph("{subject_upper} — FASE {phase} — KELAS {classStr}", { bold: true, size: 22, alignment: AlignmentType.CENTER, afterSpace: 400, color: "1D4ED8" }),
    createCustomIdentityTable(),
    createParagraph("", { afterSpace: 400 }),
    
    createParagraph("{#gradesList}", { size: 1 }),
    createParagraph("KELAS {grade}", { bold: true, size: 20, color: "1D4ED8", beforeSpace: 200, afterSpace: 100 }),
    createDesignBar(titleBarText),
    createParagraph("", { afterSpace: 200 }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        tableHeaderRow,
        tableDataRow,
      ],
    }),
    createParagraph("", { afterSpace: 400 }),
    createParagraph(noteText, { italic: true, size: 18, color: "475569" }),
    createParagraph("", { afterSpace: 400 }),
    createParagraph("{/gradesList}", { size: 1 }),
    
    createCustomSignaturesTable()
  ];
  return new Document({ sections: [{ properties: { page: { size: { orientation: "landscape" } } }, children }] });
}

function buildAlokasiTemplate(): Document {
  const children = [
    createDocumentHeader("Analisis Alokasi JP"),
    createParagraph("", { afterSpace: 200 }),
    createParagraph("ANALISIS ALOKASI WAKTU EFEKTIF PEMBELAJARAN", { bold: true, size: 30, alignment: AlignmentType.CENTER, beforeSpace: 200, afterSpace: 50, color: "1E293B" }),
    createParagraph("{subject_upper} — FASE {phase}", { bold: true, size: 22, alignment: AlignmentType.CENTER, afterSpace: 400, color: "1D4ED8" }),
    createCustomIdentityTable(),
    createParagraph("", { afterSpace: 400 }),
    createDesignBar("Analisis Waktu Efektif Pembelajaran"),
    createParagraph("", { afterSpace: 200 }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            createPremiumHeaderCell("Parameter Analisis", "1D4ED8"),
            createPremiumHeaderCell("Semester I (Ganjil)", "1D4ED8"),
            createPremiumHeaderCell("Semester II (Genap)", "1D4ED8"),
          ],
        }),
        new TableRow({
          children: [
            createPremiumCell("Jumlah Minggu Kerja Struktur Kurikulum"),
            createPremiumCell("{weeksSemester1} Minggu", { align: AlignmentType.CENTER }),
            createPremiumCell("{weeksSemester2} Minggu", { align: AlignmentType.CENTER }),
          ],
        }),
        new TableRow({
          children: [
            createPremiumCell("Jam Pelajaran Tatap Muka Per Pekan (JP)"),
            createPremiumCell("{jpPerWeek} JP", { align: AlignmentType.CENTER }),
            createPremiumCell("{jpPerWeek} JP", { align: AlignmentType.CENTER }),
          ],
        }),
        new TableRow({
          children: [
            createPremiumCell("Total Anggaran Jam Efektif Tersedia (Ketersediaan)", { bold: true }),
            createPremiumCell("{totalJpS1} JP", { bold: true, align: AlignmentType.CENTER }),
            createPremiumCell("{totalJpS2} JP", { bold: true, align: AlignmentType.CENTER }),
          ],
        }),
        new TableRow({
          children: [
            createPremiumCell("Jumlah Jam Terpakai Pembelajaran Inti / ATP"),
            createPremiumCell("{allocatedJpS1} JP", { align: AlignmentType.CENTER }),
            createPremiumCell("{allocatedJpS2} JP", { align: AlignmentType.CENTER }),
          ],
        }),
        new TableRow({
          children: [
            createPremiumCell("Sisa Kuota Waktu (Penilaian / Projek / Cadangan)"),
            createPremiumCell("{remainingJpS1} JP", { align: AlignmentType.CENTER }),
            createPremiumCell("{remainingJpS2} JP", { align: AlignmentType.CENTER }),
          ],
        }),
      ],
    }),
    createParagraph("", { afterSpace: 600 }),
    createCustomSignaturesTable()
  ];
  return new Document({ sections: [{ properties: { page: { size: { orientation: "landscape" } } }, children }] });
}

function buildAllTemplate(): Document {
  const children = [
    createParagraph("{school_name_upper}", { bold: true, size: 36, alignment: AlignmentType.CENTER, beforeSpace: 1000, afterSpace: 200, color: "1D4ED8" }),
    createParagraph("MASTER DOKUMEN ADMINISTRASI PEMBELAJARAN\nASISTEN AKADEMIK GURU", { bold: true, size: 24, alignment: AlignmentType.CENTER, afterSpace: 400, color: "1E293B" }),
    createParagraph("MATA PELAJARAN: {subject_upper} — FASE {phase}", { bold: true, size: 20, alignment: AlignmentType.CENTER, afterSpace: 200, color: "64748B" }),
    createParagraph("Dibuat Oleh: {author}\nNIP. {nip}", { size: 18, alignment: AlignmentType.CENTER, afterSpace: 2000, color: "334155" }),
    
    new Paragraph({ text: "", pageBreakBefore: true }),
    createDocumentHeader("Capaian Pembelajaran"),
    createParagraph("", { afterSpace: 200 }),
    createParagraph("ANALISIS CAPAIAN PEMBELAJARAN (CP)", { bold: true, size: 28, alignment: AlignmentType.CENTER, beforeSpace: 200, afterSpace: 100 }),
    createParagraph("MATA PELAJARAN: {subject_upper} — FASE {phase}", { bold: true, size: 22, alignment: AlignmentType.CENTER, afterSpace: 300, color: "1D4ED8" }),
    createCustomIdentityTable(),
    createParagraph("", { afterSpace: 400 }),
    createDesignBar("Capaian Pembelajaran per Elemen"),
    createParagraph("", { afterSpace: 200 }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            createPremiumHeaderCell("Elemen", "1D4ED8"),
            createPremiumHeaderCell("Deskripsi Capaian Pembelajaran (CP) Resmi", "1D4ED8"),
          ],
        }),
        new TableRow({
          children: [
            createPremiumCell("{#elements}{name}", { bold: true }),
            createPremiumCell("{cpText}{/elements}"),
          ],
        }),
      ],
    }),
    createParagraph("", { afterSpace: 400 }),

    new Paragraph({ text: "", pageBreakBefore: true }),
    createDocumentHeader("Tujuan Pembelajaran"),
    createParagraph("", { afterSpace: 200 }),
    createParagraph("PEMETAAN & FORMULASI TUJUAN PEMBELAJARAN (TP)", { bold: true, size: 28, alignment: AlignmentType.CENTER, beforeSpace: 200, afterSpace: 100 }),
    createParagraph("MATA PELAJARAN: {subject_upper} — FASE {phase}", { bold: true, size: 22, alignment: AlignmentType.CENTER, afterSpace: 300, color: "1D4ED8" }),
    createCustomIdentityTable(),
    createParagraph("", { afterSpace: 400 }),
    
    createParagraph("{#gradesList}", { size: 1 }),
    createParagraph("KELAS {grade}", { bold: true, size: 20, color: "1D4ED8", beforeSpace: 200, afterSpace: 100 }),
    createDesignBar("Rumusan Tujuan Pembelajaran Kelas {grade}"),
    createParagraph("", { afterSpace: 200 }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            createPremiumHeaderCell("Kode", "1D4ED8"),
            createPremiumHeaderCell("Elemen", "1D4ED8"),
            createPremiumHeaderCell("Kompetensi", "1D4ED8"),
            createPremiumHeaderCell("Konten Materi", "1D4ED8"),
            createPremiumHeaderCell("Rumusan Lengkap Tujuan Pembelajaran (TP)", "1D4ED8"),
          ],
        }),
        new TableRow({
          children: [
            createPremiumCell("{#tps}{code}", { bold: true, align: AlignmentType.CENTER }),
            createPremiumCell("{element}"),
            createPremiumCell("{competency}"),
            createPremiumCell("{content}"),
            createPremiumCell("{text}{/tps}"),
          ],
        }),
      ],
    }),
    createParagraph("", { afterSpace: 400 }),
    createParagraph("{/gradesList}", { size: 1 }),

    new Paragraph({ text: "", pageBreakBefore: true }),
    createDocumentHeader("Alur Tujuan Pembelajaran"),
    createParagraph("", { afterSpace: 200 }),
    createParagraph("ALUR TUJUAN PEMBELAJARAN (ATP)", { bold: true, size: 28, alignment: AlignmentType.CENTER, beforeSpace: 200, afterSpace: 100 }),
    createParagraph("MATA PELAJARAN: {subject_upper} — FASE {phase}", { bold: true, size: 22, alignment: AlignmentType.CENTER, afterSpace: 300, color: "1D4ED8" }),
    createCustomIdentityTable(),
    createParagraph("", { afterSpace: 400 }),
    
    createParagraph("{#gradesList}", { size: 1 }),
    createParagraph("KELAS {grade}", { bold: true, size: 20, color: "1D4ED8", beforeSpace: 200, afterSpace: 100 }),
    createDesignBar("Alur Tujuan Pembelajaran Kelas {grade}"),
    createParagraph("", { afterSpace: 200 }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            createPremiumHeaderCell("No", "1D4ED8"),
            createPremiumHeaderCell("Kode", "1D4ED8"),
            createPremiumHeaderCell("Elemen", "1D4ED8"),
            createPremiumHeaderCell("Tujuan Pembelajaran (TP)", "1D4ED8"),
            createPremiumHeaderCell("Kelas", "1D4ED8"),
            createPremiumHeaderCell("Smt", "1D4ED8"),
            createPremiumHeaderCell("JP", "1D4ED8"),
            createPremiumHeaderCell("Materi Pokok / Bahasan", "1D4ED8"),
          ],
        }),
        new TableRow({
          children: [
            createPremiumCell("{#tps}{no}", { align: AlignmentType.CENTER }),
            createPremiumCell("{code}", { bold: true, align: AlignmentType.CENTER }),
            createPremiumCell("{element}"),
            createPremiumCell("{text}"),
            createPremiumCell("{grade}", { align: AlignmentType.CENTER }),
            createPremiumCell("{semester}", { align: AlignmentType.CENTER }),
            createPremiumCell("{jp}", { align: AlignmentType.CENTER }),
            createPremiumCell("{materiPokok}{/tps}"),
          ],
        }),
      ],
    }),
    createParagraph("", { afterSpace: 400 }),
    createParagraph("{/gradesList}", { size: 1 }),

    new Paragraph({ text: "", pageBreakBefore: true }),
    createDocumentHeader("Program Tahunan"),
    createParagraph("", { afterSpace: 200 }),
    createParagraph("PROGRAM TAHUNAN (PROTA)", { bold: true, size: 28, alignment: AlignmentType.CENTER, beforeSpace: 200, afterSpace: 100 }),
    createParagraph("MATA PELAJARAN: {subject_upper} — TAHUN AJARAN {academicYear}", { bold: true, size: 22, alignment: AlignmentType.CENTER, afterSpace: 300, color: "1D4ED8" }),
    createCustomIdentityTable(),
    createParagraph("", { afterSpace: 400 }),
    
    createParagraph("{#gradesList}", { size: 1 }),
    createParagraph("KELAS {grade}", { bold: true, size: 20, color: "1D4ED8", beforeSpace: 200, afterSpace: 100 }),
    createDesignBar("Distribusi Materi dan Alokasi Waktu Kelas {grade}"),
    createParagraph("", { afterSpace: 200 }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            createPremiumHeaderCell("Smt", "1D4ED8"),
            createPremiumHeaderCell("Kode Bab", "1D4ED8"),
            createPremiumHeaderCell("Cakupan Materi Pembelajaran / Bab", "1D4ED8"),
            createPremiumHeaderCell("Alokasi Waktu", "1D4ED8"),
          ],
        }),
        new TableRow({
          children: [
            createPremiumCell("Semester {semesterStr}", { align: AlignmentType.CENTER }),
            createPremiumCell("{#babs}{code}", { bold: true, align: AlignmentType.CENTER }),
            createPremiumCell("{name}"),
            createPremiumCell("{jpEstimation} JP{/babs}", { align: AlignmentType.CENTER }),
          ],
        }),
      ],
    }),
    createParagraph("", { afterSpace: 400 }),
    createParagraph("{/gradesList}", { size: 1 }),

    new Paragraph({ text: "", pageBreakBefore: true }),
    createDocumentHeader("Program Semester"),
    createParagraph("", { afterSpace: 200 }),
    createParagraph("PROGRAM SEMESTER (PROMES)", { bold: true, size: 28, alignment: AlignmentType.CENTER, beforeSpace: 200, afterSpace: 100 }),
    createParagraph("MATA PELAJARAN: {subject_upper} — FASE {phase}", { bold: true, size: 22, alignment: AlignmentType.CENTER, afterSpace: 300, color: "1D4ED8" }),
    createCustomIdentityTable(),
    createParagraph("", { afterSpace: 400 }),
    
    createParagraph("{#gradesList}", { size: 1 }),
    createParagraph("KELAS {grade}", { bold: true, size: 20, color: "1D4ED8", beforeSpace: 200, afterSpace: 100 }),
    createDesignBar("Cakupan Jadwal Pelaksanaan Mingguan Kelas {grade}"),
    createParagraph("", { afterSpace: 200 }),

    // Block 1: Semester I (Ganjil)
    createParagraph("SEMESTER I (GANJIL)", { bold: true, size: 16, color: "1D4ED8", beforeSpace: 200, afterSpace: 100 }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            createPremiumHeaderCell("Kode TP", "1D4ED8"),
            createPremiumHeaderCell("Tujuan Pembelajaran / Fokus Indikator", "1D4ED8"),
            createPremiumHeaderCell("JP", "1D4ED8"),
            createPremiumHeaderCell("M1", "1D4ED8"),
            createPremiumHeaderCell("M2", "1D4ED8"),
            createPremiumHeaderCell("M3", "1D4ED8"),
            createPremiumHeaderCell("M4", "1D4ED8"),
            createPremiumHeaderCell("Bulan Blok", "1D4ED8"),
          ],
        }),
        new TableRow({
          children: [
            createPremiumCell("{#s1Tps}{code}", { bold: true, align: AlignmentType.CENTER }),
            createPremiumCell("{text}"),
            createPremiumCell("{jp}", { align: AlignmentType.CENTER }),
            createPremiumCell("{m1}", { align: AlignmentType.CENTER }),
            createPremiumCell("{m2}", { align: AlignmentType.CENTER }),
            createPremiumCell("{m3}", { align: AlignmentType.CENTER }),
            createPremiumCell("{m4}", { align: AlignmentType.CENTER }),
            createPremiumCell("{bulan}{/s1Tps}", { align: AlignmentType.CENTER }),
          ],
        }),
      ],
    }),
    createParagraph("", { afterSpace: 400 }),

    // Block 2: Semester II (Genap)
    createParagraph("SEMESTER II (GENAP)", { bold: true, size: 16, color: "1D4ED8", beforeSpace: 200, afterSpace: 100 }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            createPremiumHeaderCell("Kode TP", "1D4ED8"),
            createPremiumHeaderCell("Tujuan Pembelajaran / Fokus Indikator", "1D4ED8"),
            createPremiumHeaderCell("JP", "1D4ED8"),
            createPremiumHeaderCell("M1", "1D4ED8"),
            createPremiumHeaderCell("M2", "1D4ED8"),
            createPremiumHeaderCell("M3", "1D4ED8"),
            createPremiumHeaderCell("M4", "1D4ED8"),
            createPremiumHeaderCell("Bulan Blok", "1D4ED8"),
          ],
        }),
        new TableRow({
          children: [
            createPremiumCell("{#s2Tps}{code}", { bold: true, align: AlignmentType.CENTER }),
            createPremiumCell("{text}"),
            createPremiumCell("{jp}", { align: AlignmentType.CENTER }),
            createPremiumCell("{m1}", { align: AlignmentType.CENTER }),
            createPremiumCell("{m2}", { align: AlignmentType.CENTER }),
            createPremiumCell("{m3}", { align: AlignmentType.CENTER }),
            createPremiumCell("{m4}", { align: AlignmentType.CENTER }),
            createPremiumCell("{bulan}{/s2Tps}", { align: AlignmentType.CENTER }),
          ],
        }),
      ],
    }),

    createParagraph("", { afterSpace: 400 }),
    createParagraph("{/gradesList}", { size: 1 }),

    new Paragraph({ text: "", pageBreakBefore: true }),
    createDocumentHeader("Kriteria Ketercapaian Tujuan Pembelajaran"),
    createParagraph("", { afterSpace: 200 }),
    createParagraph("KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP)", { bold: true, size: 28, alignment: AlignmentType.CENTER, beforeSpace: 200, afterSpace: 100 }),
    createParagraph("FOKUS PENILAIAN FORMATIF & SUMATIF MATA PELAJARAN: {subject_upper}", { bold: true, size: 22, alignment: AlignmentType.CENTER, afterSpace: 300, color: "1D4ED8" }),
    createCustomIdentityTable(),
    createParagraph("", { afterSpace: 400 }),
    
    createParagraph("{#gradesList}", { size: 1 }),
    createParagraph("KELAS {grade}", { bold: true, size: 20, color: "1D4ED8", beforeSpace: 200, afterSpace: 100 }),
    createDesignBar("Rubrik Ketercapaian (per Tujuan Pembelajaran) Kelas {grade}"),
    createParagraph("", { afterSpace: 200 }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            createPremiumHeaderCell("Tujuan Pembelajaran", "1D4ED8"),
            createPremiumHeaderCell("Perlu Bimbingan", "DC2626"),
            createPremiumHeaderCell("Cukup", "D97706"),
            createPremiumHeaderCell("Baik", "2563EB"),
            createPremiumHeaderCell("Sangat Baik", "16A34A"),
          ],
        }),
        new TableRow({
          children: [
            createPremiumCell("{#tps}{text}", { bold: true }),
            createPremiumCell("{interval1}", { bgColor: "FEF2F2", textColor: "991B1B" }),
            createPremiumCell("{interval2}", { bgColor: "FFFBEB", textColor: "92400E" }),
            createPremiumCell("{interval3}", { bgColor: "EFF6FF", textColor: "1E40AF" }),
            createPremiumCell("{interval4}{/tps}", { bgColor: "F0FDF4", textColor: "166534" }),
          ],
        }),
      ],
    }),
    createParagraph("", { afterSpace: 400 }),
    createParagraph("{/gradesList}", { size: 1 }),

    new Paragraph({ text: "", pageBreakBefore: true }),
    createDocumentHeader("Analisis Alokasi JP"),
    createParagraph("", { afterSpace: 200 }),
    createParagraph("ANALISIS ALOKASI WAKTU EFEKTIF PEMBELAJARAN", { bold: true, size: 28, alignment: AlignmentType.CENTER, beforeSpace: 200, afterSpace: 100 }),
    createParagraph("MATA PELAJARAN: {subject_upper} — FASE {phase}", { bold: true, size: 22, alignment: AlignmentType.CENTER, afterSpace: 300, color: "1D4ED8" }),
    createCustomIdentityTable(),
    createParagraph("", { afterSpace: 400 }),
    createDesignBar("Analisis Waktu Efektif Pembelajaran"),
    createParagraph("", { afterSpace: 200 }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            createPremiumHeaderCell("Parameter Analisis", "1D4ED8"),
            createPremiumHeaderCell("Semester I (Ganjil)", "1D4ED8"),
            createPremiumHeaderCell("Semester II (Genap)", "1D4ED8"),
          ],
        }),
        new TableRow({
          children: [
            createPremiumCell("Jumlah Minggu Kerja Struktur Kurikulum"),
            createPremiumCell("{weeksSemester1} Minggu", { align: AlignmentType.CENTER }),
            createPremiumCell("{weeksSemester2} Minggu", { align: AlignmentType.CENTER }),
          ],
        }),
        new TableRow({
          children: [
            createPremiumCell("Jam Pelajaran Tatap Muka Per Pekan (JP)"),
            createPremiumCell("{jpPerWeek} JP", { align: AlignmentType.CENTER }),
            createPremiumCell("{jpPerWeek} JP", { align: AlignmentType.CENTER }),
          ],
        }),
        new TableRow({
          children: [
            createPremiumCell("Total Anggaran Jam Efektif Tersedia (Ketersediaan)", { bold: true }),
            createPremiumCell("{totalJpS1} JP", { bold: true, align: AlignmentType.CENTER }),
            createPremiumCell("{totalJpS2} JP", { bold: true, align: AlignmentType.CENTER }),
          ],
        }),
        new TableRow({
          children: [
            createPremiumCell("Jumlah Jam Terpakai Pembelajaran Inti / ATP"),
            createPremiumCell("{allocatedJpS1} JP", { align: AlignmentType.CENTER }),
            createPremiumCell("{allocatedJpS2} JP", { align: AlignmentType.CENTER }),
          ],
        }),
        new TableRow({
          children: [
            createPremiumCell("Sisa Kuota Waktu (Penilaian / Projek / Cadangan)"),
            createPremiumCell("{remainingJpS1} JP", { align: AlignmentType.CENTER }),
            createPremiumCell("{remainingJpS2} JP", { align: AlignmentType.CENTER }),
          ],
        }),
      ],
    }),
    createParagraph("", { afterSpace: 600 }),

    createCustomSignaturesTable()
  ];
  return new Document({ sections: [{ properties: { page: { size: { orientation: "landscape" } } }, children }] });
}

// =========================================================================
// DATA ENRICHMENT & COMPILATION USING DOCXTEMPLATER
// =========================================================================

export function enrichDataForDocxtemplater(data: any) {
  const identity = data.identity || {};
  const tpsList = data.tps || [];
  const babsList = data.babs || [];
  const elementsList = data.elements || [];
  const promesSelections = data.promesSelections || {};

  const classStr = (identity.grades || []).join(", ");
  const totalJpS1 = Number(identity.jpPerWeek || 0) * Number(identity.weeksSemester1 || 0);
  const totalJpS2 = Number(identity.jpPerWeek || 0) * Number(identity.weeksSemester2 || 0);

  const allocatedJpS1 = tpsList
    .filter((t: any) => Number(t.semester) === 1)
    .reduce((acc: number, curr: any) => acc + Number(curr.jp || 0), 0);
  const allocatedJpS2 = tpsList
    .filter((t: any) => Number(t.semester) === 2)
    .reduce((acc: number, curr: any) => acc + Number(curr.jp || 0), 0);

  const weekJp = Number(identity.jpPerWeek || 3);

  // First pass: Global enrichedTps mapping
  const globalWeekMap: Record<string, number> = {};
  const enrichedTps = tpsList.map((tp: any, index: number) => {
    const tpGrade = tp.grade || identity.grades?.[0] || "7";
    const tpSemester = Number(tp.semester || 1);
    const key = `${tpGrade}-${tpSemester}`;
    if (globalWeekMap[key] === undefined) {
      globalWeekMap[key] = 1;
    }
    const startWeek = globalWeekMap[key];
    const tpJp = tp.jpAlokasi !== undefined ? tp.jpAlokasi : (tp.jp || 2);
    const neededWeeks = Math.max(1, Math.ceil(Number(tpJp) / weekJp));
    const endWeek = startWeek + neededWeeks - 1;
    globalWeekMap[key] = endWeek + 1;

    const occupiedWeeks: number[] = [];
    for (let w = startWeek; w <= endWeek; w++) {
      occupiedWeeks.push(w);
    }

    const months = tpSemester === 2
      ? ["Januari", "Februari", "Maret", "April", "Mei", "Juni"]
      : ["Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    const occupiedMonths = occupiedWeeks.map((w) => {
      const monthIdx = Math.min(5, Math.floor((w - 1) / 4));
      return months[monthIdx];
    });
    const uniqueMonths = Array.from(new Set(occupiedMonths));
    const bulanBlok = uniqueMonths.join("-");

    const mVals: Record<string, string> = {};
    for (let wk = 1; wk <= 5; wk++) {
      const defaultChecked = occupiedWeeks.some((w) => ((w - 1) % 4) + 1 === wk);
      const selKey = `${tp.id}-${wk}`;
      const checked = promesSelections[selKey] !== undefined ? promesSelections[selKey] : defaultChecked;
      mVals[`m${wk}`] = checked ? "V" : "";
    }

    const cleanTp = {
      ...tp,
      no: (index + 1).toString(),
      grade: tpGrade,
      semester: tpSemester,
      materiPokok: tp.materiPokok || tp.content || "",
      ...mVals,
      bulan: bulanBlok,
      interval1: "Siswa belum menguasai indikator fundamental dan butuh intervensi intensif.",
      interval2: "Siswa mulai menunjukkan pemahaman dasar namun beberapa aspek membutuhkan bimbingan ulang.",
      interval3: "Siswa telah menguasai kompetensi esensial kurikulum secara mandiri.",
      interval4: "Siswa menginternalisasi materi secara sempurna dan siap dijadikan tutor sebaya.",
    };

    // Add nested structures matching Indonesian template variables
    cleanTp.kktp = {
      kalimatTP: tp.text || "",
      perluBimbingan: cleanTp.interval1,
      cukup: cleanTp.interval2,
      baik: cleanTp.interval3,
      sangatBaik: cleanTp.interval4,
    };
    cleanTp.promes = {
      no: (index + 1).toString(),
      kalimatTP: tp.text || "",
      jpAlokasi: tp.jp || "",
    };
    cleanTp.tp = {
      no: (index + 1).toString(),
      kalimatTP: tp.text || "",
      topikMateri: tp.content || tp.materiPokok || "",
      kodeAktivitas: tp.activityCode || tp.code || "",
      jpAlokasi: tp.jp || "",
      elemenRef: tp.element || "",
      levelKKO: tp.levelKKO || tp.competency || "",
    };
    cleanTp.atp = {
      no: (index + 1).toString(),
      judulBab: tp.babName || tp.materiPokok || "Materi Pokok",
      kalimatTP: tp.text || "",
      kodeAktivitas: tp.activityCode || tp.code || "",
      jpAlokasi: tp.jp || "",
    };

    return cleanTp;
  });

  const enrichedBabs = babsList.map((bab: any) => {
    return {
      ...bab,
      semesterStr: bab.semester === 1 ? "I (Ganjil)" : "II (Genap)",
    };
  });

  const totalJpSetahun = babsList.reduce((sum: number, b: any) => sum + Number(b.jpEstimation || 0), 0);

  const schoolAddressFirst = identity.schoolAddress ? identity.schoolAddress.split(',')[0] : "Malang";
  const currentDate = "2026/2027";

  const grades = identity.grades && identity.grades.length > 0 ? identity.grades : ["7"];
  const gradesList = grades.map((g: string) => {
    const gradeBabs = babsList
      .filter((b: any) => (b.grade || identity.grades?.[0] || "7") === g)
      .map((bab: any) => ({
        ...bab,
        semesterStr: bab.semester === 1 ? "I (Ganjil)" : "II (Genap)",
      }));

    const gradeTotalJp = gradeBabs.reduce((sum: number, b: any) => sum + Number(b.jpEstimation || 0), 0);

    const gradeWeekMap: Record<string, number> = {};
    const gradeTps = tpsList
      .filter((tp: any) => (tp.grade || identity.grades?.[0] || "7") === g)
      .map((tp: any, index: number) => {
        const tpSemester = Number(tp.semester || 1);
        const key = `${g}-${tpSemester}`;
        if (gradeWeekMap[key] === undefined) {
          gradeWeekMap[key] = 1;
        }
        const startWeek = gradeWeekMap[key];
        const tpJp = tp.jpAlokasi !== undefined ? tp.jpAlokasi : (tp.jp || 2);
        const neededWeeks = Math.max(1, Math.ceil(Number(tpJp) / weekJp));
        const endWeek = startWeek + neededWeeks - 1;
        gradeWeekMap[key] = endWeek + 1;

        const occupiedWeeks: number[] = [];
        for (let w = startWeek; w <= endWeek; w++) {
          occupiedWeeks.push(w);
        }

        const months = tpSemester === 2
          ? ["Januari", "Februari", "Maret", "April", "Mei", "Juni"]
          : ["Juli", "Agustus", "September", "Oktober", "November", "Desember"];

        const occupiedMonths = occupiedWeeks.map((w) => {
          const monthIdx = Math.min(5, Math.floor((w - 1) / 4));
          return months[monthIdx];
        });
        const uniqueMonths = Array.from(new Set(occupiedMonths));
        const bulanBlok = uniqueMonths.join("-");

        const mVals: Record<string, string> = {};
        for (let wk = 1; wk <= 5; wk++) {
          const defaultChecked = occupiedWeeks.some((w) => ((w - 1) % 4) + 1 === wk);
          const selKey = `${tp.id}-${wk}`;
          const checked = promesSelections[selKey] !== undefined ? promesSelections[selKey] : defaultChecked;
          mVals[`m${wk}`] = checked ? "V" : "";
        }

        const cleanTp = {
          ...tp,
          no: (index + 1).toString(),
          grade: g,
          semester: tpSemester,
          materiPokok: tp.materiPokok || tp.content || "",
          ...mVals,
          bulan: bulanBlok,
          interval1: "Siswa belum menguasai indikator fundamental dan butuh intervensi intensif.",
          interval2: "Siswa mulai menunjukkan pemahaman dasar namun beberapa aspek membutuhkan bimbingan ulang.",
          interval3: "Siswa telah menguasai kompetensi esensial kurikulum secara mandiri.",
          interval4: "Siswa menginternalisasi materi secara sempurna dan siap dijadikan tutor sebaya.",
        };

        return {
          ...cleanTp,
          kktp: {
            kalimatTP: cleanTp.text || "",
            perluBimbingan: cleanTp.interval1,
            cukup: cleanTp.interval2,
            baik: cleanTp.interval3,
            sangatBaik: cleanTp.interval4,
          },
          promes: {
            no: (index + 1).toString(),
            kalimatTP: cleanTp.text || "",
            jpAlokasi: cleanTp.jp || "",
          },
          tp: {
            no: (index + 1).toString(),
            kalimatTP: cleanTp.text || "",
            topikMateri: cleanTp.content || cleanTp.materiPokok || "",
            kodeAktivitas: cleanTp.activityCode || cleanTp.code || "",
            jpAlokasi: cleanTp.jp || "",
            elemenRef: cleanTp.element || "",
            levelKKO: cleanTp.levelKKO || cleanTp.competency || "",
          },
          atp: {
            no: (index + 1).toString(),
            judulBab: cleanTp.babName || cleanTp.materiPokok || "Materi Pokok",
            kalimatTP: cleanTp.text || "",
            kodeAktivitas: cleanTp.activityCode || cleanTp.code || "",
            jpAlokasi: cleanTp.jp || "",
          },
        };
      });

    return {
      grade: g,
      tps: gradeTps,
      s1Tps: gradeTps.filter((tp: any) => Number(tp.semester) === 1),
      s2Tps: gradeTps.filter((tp: any) => Number(tp.semester) === 2),
      babs: gradeBabs,
      totalJpSetahun: gradeTotalJp,
    };
  });

  return {
    ...data,
    identity,
    schoolName: identity.schoolName || "-",
    academicYear: identity.academicYear || "-",
    subject: identity.subject || "-",
    author: identity.author || "-",
    phase: identity.phase || "-",
    classStr: classStr || "-",
    jpPerWeek: identity.jpPerWeek || 0,
    curriculumName: identity.curriculumName || "Kurikulum Merdeka",
    nip: identity.nip || "-",
    nipStr: identity.nip ? `NIP. ${identity.nip}` : "NIP. .................___________",
    weeksSemester1: identity.weeksSemester1 || 0,
    weeksSemester2: identity.weeksSemester2 || 0,
    totalJpS1,
    totalJpS2,
    allocatedJpS1,
    allocatedJpS2,
    remainingJpS1: totalJpS1 - allocatedJpS1,
    remainingJpS2: totalJpS2 - allocatedJpS2,
    schoolAddressFirst,
    currentDate,
    subject_upper: (identity.subject || "").toUpperCase(),
    school_name_upper: (identity.schoolName || "").toUpperCase(),
    totalJpSetahun,

    // Legacy/Indonesian exact layout mappings
    namaSekolah: identity.schoolName || "-",
    namaGuru: identity.author || "-",
    fase: identity.phase || "-",
    kelas: classStr || "-",
    tahunPelajaran: identity.academicYear || "-",
    mataPelajaran: identity.subject || "-",
    tempatTandaTangan: schoolAddressFirst || "Malang",
    tanggalCetak: currentDate || "2026",
    namaKepalaSekolah: identity.kepalaSekolah || "-",
    nipKepalaSekolah: identity.nipKepalaSekolah || "-",
    totalJpIntrakurikuler: totalJpSetahun,
    totalJp: totalJpSetahun,

    elements: elementsList,
    tps: enrichedTps,
    babs: enrichedBabs,
    gradesList,
  };
}

const TEMPLATE_NAMES = ["cp", "tp", "atp", "prota", "promes", "kktp", "alokasi", "all"];

export async function ensureDefaultTemplates(): Promise<void> {
  try {
    const templatesDir = path.join(process.cwd(), "server", "templates");
    if (!fs.existsSync(templatesDir)) {
      try {
        fs.mkdirSync(templatesDir, { recursive: true });
      } catch (err) {
        console.warn("Could not create templates directory on disk (expected in read-only environments):", err);
      }
    }

    for (const name of TEMPLATE_NAMES) {
      const templatePath = path.join(templatesDir, `${name}.docx`);
      try {
        let doc: Document;
        if (name === "cp") doc = buildCpTemplate();
        else if (name === "tp") doc = buildTpTemplate();
        else if (name === "atp") doc = buildAtpTemplate();
        else if (name === "prota") doc = buildProtaTemplate();
        else if (name === "promes") doc = buildPromesTemplate();
        else if (name === "kktp") doc = buildKktpTemplate();
        else if (name === "alokasi") doc = buildAlokasiTemplate();
        else doc = buildAllTemplate();

        const docBuffer = await Packer.toBuffer(doc);
        fs.writeFileSync(templatePath, docBuffer);
      } catch (err) {
        // Safe to ignore or warn on read-only environments
        console.warn(`Could not write template ${name}.docx to disk:`, err);
      }
    }
  } catch (error) {
    console.warn("Failed to ensure default templates on disk:", error);
  }
}

/**
 * Loads a word template and fills placeholders using docxtemplater and the SesiKurikulum dataset.
 * Runs 100% in-memory for lightning-fast performance and compatibility with read-only filesystems (e.g., Vercel, AWS Lambda).
 */
export async function generateDocx(templateName: string, data: any): Promise<Buffer> {
  // Generate the baseline document directly in-memory
  let doc: Document;
  if (templateName === "cp") doc = buildCpTemplate();
  else if (templateName === "tp") doc = buildTpTemplate();
  else if (templateName === "atp") doc = buildAtpTemplate();
  else if (templateName === "prota") doc = buildProtaTemplate();
  else if (templateName === "promes") doc = buildPromesTemplate();
  else if (templateName === "kktp") doc = buildKktpTemplate(data?.kktpOption || "A");
  else if (templateName === "alokasi") doc = buildAlokasiTemplate();
  else doc = buildAllTemplate();

  const docBuffer = await Packer.toBuffer(doc);
  const zip = new PizZip(docBuffer);
  
  const docx = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    nullGetter() {
      return "";
    }
  });

  // Enrich the raw data object with computed values, indices, and duplicates for safe templating 
  const enriched = enrichDataForDocxtemplater(data);

  try {
    docx.render(enriched);
  } catch (renderError: any) {
    console.error("================ DOCXTEMPLATER RENDER ERROR ================");
    console.error("Error Message:", renderError.message);
    if (renderError.properties && renderError.properties.errors) {
      console.error("Detailed Errors:", JSON.stringify(renderError.properties.errors, null, 2));
    } else if (renderError.properties) {
      console.error("Properties:", JSON.stringify(renderError.properties, null, 2));
    }
    console.error("Enriched Data Payload Sample:", JSON.stringify({
      identity: enriched.identity,
      tpsCount: enriched.tps?.length,
      babsCount: enriched.babs?.length
    }, null, 2));
    console.error("=========================================================");
    throw new Error(`Template render gagal: ${renderError.message}`);
  }

  const buf = docx.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  return buf;
}
