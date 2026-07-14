import { CurriculumElement, BabMateri } from "../types";

export interface SubjectOption {
  value: string;
  label: string;
  defaultGrades: { [phase: string]: string[] };
}

export const subjectOptions: SubjectOption[] = [
  {
    value: "Matematika",
    label: "Matematika",
    defaultGrades: {
      A: ["1", "2"],
      B: ["3", "4"],
      C: ["5", "6"],
      D: ["7", "8", "9"],
      E: ["10"],
      F: ["11", "12"]
    }
  },
  {
    value: "Pancasila",
    label: "Pendidikan Pancasila",
    defaultGrades: {
      A: ["1", "2"],
      B: ["3", "4"],
      C: ["5", "6"],
      D: ["7", "8", "9"],
      E: ["10"],
      F: ["11", "12"]
    }
  },
  {
    value: "Bahasa Indonesia",
    label: "Bahasa Indonesia",
    defaultGrades: {
      A: ["1", "2"],
      B: ["3", "4"],
      C: ["5", "6"],
      D: ["7", "8", "9"],
      E: ["10"],
      F: ["11", "12"]
    }
  },
  {
    value: "Bahasa Inggris",
    label: "Bahasa Inggris",
    defaultGrades: {
      B: ["3", "4"],
      C: ["5", "6"],
      D: ["7", "8", "9"],
      E: ["10"],
      F: ["11", "12"]
    }
  },
  {
    value: "IPA",
    label: "Ilmu Pengetahuan Alam (IPA/IPAS)",
    defaultGrades: {
      B: ["3", "4"],
      C: ["5", "6"],
      D: ["7", "8", "9"],
      E: ["10"]
    }
  },
  {
    value: "Informatika",
    label: "Informatika",
    defaultGrades: {
      D: ["7", "8", "9"],
      E: ["10"],
      F: ["11", "12"]
    }
  },
  {
    value: "Fisika",
    label: "Fisika (Fase F)",
    defaultGrades: {
      F: ["11", "12"]
    }
  },
  {
    value: "Kimia",
    label: "Kimia (Fase F)",
    defaultGrades: {
      F: ["11", "12"]
    }
  },
  {
    value: "Biologi",
    label: "Biologi (Fase F)",
    defaultGrades: {
      F: ["11", "12"]
    }
  },
  {
    value: "Custom",
    label: "Mapel Lainnya (Teks CP Bebas / Kustom)",
    defaultGrades: {
      A: ["1", "2"],
      B: ["3", "4"],
      C: ["5", "6"],
      D: ["7", "8", "9"],
      E: ["10"],
      F: ["11", "12"]
    }
  }
];

export const getPresetElements = (subject: string, phase: string): CurriculumElement[] => {
  if (subject === "Matematika") {
    if (phase === "D") {
      return [
        {
          name: "Bilangan",
          cpText: "Membaca, menulis, dan membandingkan bilangan bulat, bilangan rasional, bilangan desimal, bilangan berpangkat bulat dan akar, bilangan dalam notasi ilmiah; menerapkan operasi aritmatika pada bilangan real, dan memberikan estimasi/perkiraan dalam menyelesaikan masalah (termasuk berkaitan dengan literasi finansial). Murid dapat menggunakan rasio (skala, proporsi, dan laju perubahan) dalam penyelesaian masalah."
        },
        {
          name: "Aljabar",
          cpText: "Mengenali, memprediksi dan menggeneralisasi pola dalam bentuk susunan benda dan bilangan; Menyatakan suatu situasi ke dalam bentuk aljabar; menggunakan sifat-sifat operasi untuk menghasilkan bentuk aljabar yang ekuivalen; memahami relasi dan fungsi serta menyajikannya dalam diagram, tabel, pasangan berurutan dan grafik; menyelesaikan persamaan dan pertidaksamaan linear satu variabel, menyelesaikan SPLDV untuk penyelesaian masalah."
        },
        {
          name: "Pengukuran",
          cpText: "Menentukan keliling, luas, panjang busur, sudut dan luas juring lingkaran; menjelaskan cara menentukan luas permukaan dan volume bangun ruang (prisma, tabung, bola, limas dan kerucut); dan menjelaskan pengaruh perubahan secara proporsional dari bangun datar dan bangun ruang terhadap ukuran panjang, luas, dan/atau volume."
        },
        {
          name: "Geometri",
          cpText: "Membuat jaring-jaring bangun ruang; menggunakan hubungan antar-sudut untuk menyelesaikan masalah; menjelaskan sifat-sifat kekongruenan dan kesebangunan pada segitiga dan segiempat; membuktikan teorema Pythagoras dan menggunakannya dalam menyelesaikan masalah; melakukan transformasi tunggal (refleksi, translasi, rotasi, dan dilatasi) titik, garis, dan bangun datar pada koordinat Kartesius."
        },
        {
          name: "Analisis Data dan Peluang",
          cpText: "Merumuskan pertanyaan, mengumpulkan, menyajikan, dan menganalisis data untuk menjawab pertanyaan; menggunakan diagram batang dan lingkaran; mengambil sampel populasi; menentukan rerata, median, modus, dan jangkauan; menjelaskan dan menggunakan pengertian peluang dan frekuensi relatif."
        }
      ];
    } else if (phase === "A") {
      return [
        {
          name: "Bilangan",
          cpText: "Menunjukkan pemahaman dan memiliki intuisi bilangan (number sense) pada bilangan cacah sampai 100; melakukan operasi penjumlahan dan pengurangan menggunakan benda-benda konkret sampai 20; menunjukkan pemahaman pecahan setengah dan seperempat."
        },
        {
          name: "Aljabar",
          cpText: "Menunjukkan pemahaman makna simbol = dalam kalimat matematika penjumlahan dan pengurangan sampai 20 menggunakan gambar; mengenali, meniru, dan melanjutkan pola bukan bilangan."
        },
        {
          name: "Pengukuran",
          cpText: "Membandingkan panjang dan berat benda secara langsung, membandingkan durasi waktu; mengukur dan mengestimasi menggunakan satuan tidak baku."
        },
        {
          name: "Geometri",
          cpText: "Mengenal berbagai bangun datar (segitiga, segiempat, segi banyak, lingkaran) dan bangun ruang (balok, kubus, kerucut, bola); melakukan komposisi dan dekomposisi bangun datar."
        },
        {
          name: "Analisis Data",
          cpText: "Mengurutkan, menyortir, mengelompokkan, membandingkan, dan menyajikan data dari banyak benda menggunakan turus dan piktogram maksimal 4 kategori."
        }
      ];
    } else if (phase === "B") {
      return [
        {
          name: "Bilangan",
          cpText: "Memiliki pemahaman bilangan cacah sampai 10.000; melakukan penjumlahan dan pengurangan sampai 1.000; melakukan perkalian dan pembagian sampai 100; mengenal kelipatan dan faktor; membandingkan dan mengurutkan pecahan; desimal dan persen."
        },
        {
          name: "Aljabar",
          cpText: "Menemukan nilai yang tidak diketahui dalam kalimat matematika penjumlahan/pengurangan bilangan cacah sampai 100; mengidentifikasi, meniru, dan mengembangkan pola gambar/objek."
        },
        {
          name: "Pengukuran",
          cpText: "Mengukur panjang dan berat menggunakan satuan baku (cm, m, g, kg); mengestimasi luas dan volume menggunakan satuan baku dan tidak baku."
        },
        {
          name: "Geometri",
          cpText: "Mendeskripsikan ciri bangun datar; melakukan komposisi dan dekomposisi bangun datar dengan lebih dari satu cara."
        },
        {
          name: "Analisis Data",
          cpText: "Mengurutkan, membandingkan, menyajikan, menganalisis, dan menginterpretasi data dalam bentuk tabel, diagram gambar, piktogram, dan diagram batang."
        }
      ];
    } else if (phase === "E") {
      return [
        {
          name: "Bilangan",
          cpText: "Menggeneralisasi sifat-sifat bilangan berpangkat (termasuk pangkat pecahan), dan menggunakannya untuk menyelesaikan masalah."
        },
        {
          name: "Aljabar dan Fungsi",
          cpText: "Menyelesaikan masalah yang berkaitan dengan sistem pertidaksamaan linear dua variabel, persamaan dan fungsi kuadrat, serta persamaan eksponensial."
        },
        {
          name: "Geometri",
          cpText: "Mengaplikasikan perbandingan trigonometri (sin, cos, tan) dari sudut lancip."
        },
        {
          name: "Analisis Data dan Peluang",
          cpText: "Merepresentasikan dan menginterpretasi data (jangkauan kuartil, interkuartil, box plot, histogram, dot plot); menggunakan diagram pencar untuk menjelaskan hubungan dua variabel; mengevaluasi laporan statistika."
        }
      ];
    } else {
      // generic fallback for other phases of Matematika
      return [
        { name: "Bilangan", cpText: "Capaian Pembelajaran Elemen Bilangan untuk Fase " + phase },
        { name: "Aljabar", cpText: "Capaian Pembelajaran Elemen Aljabar untuk Fase " + phase },
        { name: "Pengukuran / Geometri", cpText: "Capaian Pembelajaran Elemen Geometri/Pengukuran untuk Fase " + phase },
        { name: "Analisis Data dan Peluang", cpText: "Capaian Pembelajaran Elemen Analisis Data untuk Fase " + phase }
      ];
    }
  }

  if (subject === "Pancasila") {
    if (phase === "D") {
      return [
        {
          name: "Pancasila",
          cpText: "Memahami sejarah kelahiran Pancasila; kedudukan Pancasila sebagai dasar negara, pandangan hidup bangsa, dan ideologi negara; menerapkan nilai-nilai Pancasila dalam kehidupan sehari-hari; memahami keterkaitan Pancasila dengan UUD 1945, Bhinneka Tunggal Ika, dan NKRI."
        },
        {
          name: "Undang-Undang Dasar 1945",
          cpText: "Menerapkan norma dan aturan; memahami tata urutan peraturan perundang-undangan; menggunakan hak dan kewajiban sebagai warga negara; memahami sejarah, fungsi dan kedudukan UUD NRI 1945; mempraktikkan kemerdekaan berpendapat."
        },
        {
          name: "Bhinneka Tunggal Ika",
          cpText: "Mengidentifikasi keberagaman SARA dalam bingkai Bhinneka Tunggal Ika dan menerima keberagaman tersebut; memahami pentingnya pelestarian kearifan lokal dan budaya daerah; bekerjasama melestarikan tradisi dalam masyarakat global."
        },
        {
          name: "Negara Kesatuan Republik Indonesia",
          cpText: "Memahami Proklamasi Kemerdekaan Republik Indonesia; memahami wilayah NKRI dalam konteks wawasan nusantara; berpartisipasi aktif menjaga keutuhan wilayah NKRI."
        }
      ];
    } else if (phase === "A") {
      return [
        {
          name: "Pancasila",
          cpText: "Mengenal bendera negara, lagu kebangsaan, lambang negara Garuda Pancasila, simbol dan sila-sila Pancasila; menerapkan nilai-nilai Pancasila di lingkungan keluarga."
        },
        {
          name: "Undang-Undang Dasar 1945",
          cpText: "Mengenal aturan di lingkungan keluarga; menunjukkan dan menceritakan sikap mematuhi aturan di keluarga."
        },
        {
          name: "Bhinneka Tunggal Ika",
          cpText: "Mengenal semboyan Bhinneka Tunggal Ika; mengidentifikasi dan menghargai identitas dirinya berdasarkan hobi, bahasa, jenis kelamin, agama dan kepercayaan di lingkungan sekitar."
        },
        {
          name: "Negara Kesatuan Republik Indonesia",
          cpText: "Mengenal karakteristik lingkungan sekitar rumah dan sekolah sebagai bagian wilayah NKRI; mempraktikkan kerja sama menjaga lingkungan."
        }
      ];
    } else {
      return [
        { name: "Pancasila", cpText: "Menerapkan nilai-nilai Pancasila dalam kehidupan fungsional Fase " + phase },
        { name: "Undang-Undang Dasar 1945", cpText: "Menerapkan aturan, norma, hak, dan kewajiban asasi Fase " + phase },
        { name: "Bhinneka Tunggal Ika", cpText: "Nilai harmonisasi keragaman SARA dan persatuan bangsa Fase " + phase },
        { name: "NKRI", cpText: "Sikap bela negara, cinta tanah air dan menjaga keutuhan wilayah Fase " + phase }
      ];
    }
  }

  if (subject === "Bahasa Indonesia") {
    return [
      {
        name: "Menyimak",
        cpText: "Menerima, menganalisis, mengevaluasi informasi, gagasan, pandangan, atau pesan dari teks nonsastra/sastra berbentuk aural yang didengar untuk menyiapkan tanggapan yang relevan."
      },
      {
        name: "Membaca dan Memirsa",
        cpText: "Memahami, menganalisis, menginterpretasi, mengevaluasi, dan merefleksikan sajian teks visual, audio visual, cetak, atau digital untuk mengidentifikasi gagasan utama dan makna tersirat."
      },
      {
        name: "Berbicara dan Mempresentasikan",
        cpText: "Menyampaikan gagasan, tanggapan secara fasih, kritis, akurat, santun, dan komunikatif sesuai konteks menggunakan media visual, digital, audio, atau audiovisual."
      },
      {
        name: "Menulis",
        cpText: "Menuliskan gagasan, perasaan, pandangan secara kreatif, logis, kritis, dan indah dengan rangkaian kalimat yang beragam dan menggunakan kaidah bahasa yang tepat."
      }
    ];
  }

  if (subject === "Bahasa Inggris") {
    return [
      {
        name: "Menyimak - Berbicara",
        cpText: "Memahami alur informasi, gagasan utama, dan detail dari teks lisan fiksi dan nonfiksi sesuai konteks; menggunakan Bahasa Inggris secara lisan untuk mengekspresikan gagasan, pendapat, dan argumen."
      },
      {
        name: "Membaca - Memirsa",
        cpText: "Memahami alur informasi secara keseluruhan, menganalisis, menginterpretasi, dan menyimpulkan informasi tersurat dan tersirat dalam beragam jenis teks."
      },
      {
        name: "Menulis - Mempresentasikan",
        cpText: "Mengomunikasikan gagasan, perasaan, dan pengalaman secara tertulis atau multimodal dengan struktur organisasi dan kaidah bahasa yang tepat untuk membela argumen."
      }
    ];
  }

  if (subject === "IPA") {
    return [
      {
        name: "Pemahaman IPA (Sains)",
        cpText: "Memahami konsep-konsep dasar klasifikasi makhluk hidup, organisasi kehidupan, sistem organ, pewarisan sifat, gaya, usaha, energi, kelistrikan, kemagnetan, bumi, tata surya, dan kelestarian ekosistem."
      },
      {
        name: "Keterampilan Proses",
        cpText: "Melatih keterampilan mengamati, mempertanyakan & memprediksi, merencanakan & melakukan penyelidikan, memproses & menganalisis data, mengevaluasi & merefleksi, serta mengomunikasikan hasil kerja ilmiah."
      }
    ];
  }

  if (subject === "Informatika") {
    return [
      {
        name: "Berpikir Komputasional",
        cpText: "Menerapkan dekomposisi, abstraksi, pengenalan pola, dan perancangan algoritma untuk pemecahan masalah kompleks secara sistematis, logis, dan kreatif."
      },
      {
        name: "Literasi Digital",
        cpText: "Kecakapan menggunakan media digital secara aman, beretika, produktif, serta berbudaya Pancasila; melestarikan warisan nasional melalui ruang digital."
      },
      {
        name: "Analisis Data",
        cpText: "Menstrukturkan, mengolah, menganalisis, menyimpulkan, dan menyajikan data kuantitatif dalam format tabel, grafik, maupun diagram."
      },
      {
        name: "Algoritma dan Pemrograman",
        cpText: "Menulis dan membaca teks algoritma terstruktur (perulangan, percabangan) ke dalam bentuk kode program terstruktur secara kolaboratif."
      }
    ];
  }

  // default / custom fallback
  return [
    {
      name: "Elemen 1",
      cpText: "Silakan masukkan atau edit Capaian Pembelajaran (CP) untuk Elemen 1 di sini."
    },
    {
      name: "Elemen 2",
      cpText: "Silakan masukkan atau edit Capaian Pembelajaran (CP) untuk Elemen 2 di sini."
    }
  ];
};

export interface BabPreset {
  code: string;
  name: string;
  semester: number;
  jpEstimation: number;
  grade?: string;
}

export const getPresetBabs = (jenjang: string, phase: string, subject: string, selectedGrades?: string[]): BabMateri[] => {
  const normalizedSubject = (subject || "").toLowerCase();
  const list: BabPreset[] = [];

  if (jenjang === "PAUD") {
    if (normalizedSubject.includes("agama") || normalizedSubject.includes("budi pekerti")) {
      list.push(
        { code: "BAB 1", name: "Mengenal Ciptaan Tuhan dan Bersyukur", semester: 1, jpEstimation: 12, grade: "TK A" },
        { code: "BAB 2", name: "Menyayangi Sesama Makhluk Hidup", semester: 1, jpEstimation: 12, grade: "TK A" },
        { code: "BAB 3", name: "Praktek Berdoa dan Ibadah Harian", semester: 2, jpEstimation: 12, grade: "TK B" },
        { code: "BAB 4", name: "Menjaga Kebersihan Diri dan Lingkungan", semester: 2, jpEstimation: 12, grade: "TK B" }
      );
    } else if (normalizedSubject.includes("literasi") || normalizedSubject.includes("steam") || normalizedSubject.includes("sains")) {
      list.push(
        { code: "BAB 1", name: "Eksplorasi Warna, Bentuk dan Ukuran", semester: 1, jpEstimation: 16, grade: "TK A" },
        { code: "BAB 2", name: "Mendengar Cerita dan Bermain Huruf", semester: 1, jpEstimation: 16, grade: "TK A" },
        { code: "BAB 3", name: "Eksplorasi Alam Semesta dan Cuaca", semester: 2, jpEstimation: 16, grade: "TK B" },
        { code: "BAB 4", name: "Merancang Bangunan dan Blok Konstruksi", semester: 2, jpEstimation: 16, grade: "TK B" }
      );
    } else {
      list.push(
        { code: "BAB 1", name: "Mengenal Identitas Diri dan Teman", semester: 1, jpEstimation: 14, grade: "TK A" },
        { code: "BAB 2", name: "Mengekspresikan Emosi Sehat", semester: 1, jpEstimation: 14, grade: "TK A" },
        { code: "BAB 3", name: "Bermain Motorik Kasar dan Halus", semester: 2, jpEstimation: 14, grade: "TK B" },
        { code: "BAB 4", name: "Mengenal Budaya dan Seni Daerah", semester: 2, jpEstimation: 14, grade: "TK B" }
      );
    }
  } else if (jenjang === "SD") {
    if (normalizedSubject.includes("matematika")) {
      if (phase === "A") {
        list.push(
          { code: "BAB 1", name: "Bilangan Cacah Sampai 20 dan Lambangnya", semester: 1, jpEstimation: 16, grade: "1" },
          { code: "BAB 2", name: "Penjumlahan dan Pengurangan Sederhana", semester: 1, jpEstimation: 20, grade: "1" },
          { code: "BAB 3", name: "Mengenal Bangun Datar dan Ruang di Sekitar", semester: 2, jpEstimation: 16, grade: "2" },
          { code: "BAB 4", name: "Pengukuran Panjang dan Berat dengan Satuan Tidak Baku", semester: 2, jpEstimation: 20, grade: "2" }
        );
      } else if (phase === "B") {
        list.push(
          { code: "BAB 1", name: "Bilangan Cacah Sampai 10.000 dan Polanya", semester: 1, jpEstimation: 24, grade: "3" },
          { code: "BAB 2", name: "Perkalian dan Pembagian Bilangan Bulat", semester: 1, jpEstimation: 24, grade: "3" },
          { code: "BAB 3", name: "Pecahan Sederhana dan Desimal", semester: 2, jpEstimation: 24, grade: "4" },
          { code: "BAB 4", name: "Pengukuran Luas, Volume, dan Penyajian Data", semester: 2, jpEstimation: 24, grade: "4" }
        );
      } else {
        list.push(
          { code: "BAB 1", name: "Bilangan Desimal, Persen dan Operasi Hitungnya", semester: 1, jpEstimation: 24, grade: "5" },
          { code: "BAB 2", name: "Rasio, Skala dan Proporsi Kehidupan", semester: 1, jpEstimation: 24, grade: "5" },
          { code: "BAB 3", name: "Kubus, Balok, Sudut dan Transformasinya", semester: 2, jpEstimation: 24, grade: "6" },
          { code: "BAB 4", name: "Statistika Dasar dan Peluang Teoretis", semester: 2, jpEstimation: 24, grade: "6" }
        );
      }
    } else if (normalizedSubject.includes("pancasila")) {
      list.push(
        { code: "BAB 1", name: "Aku Cinta Pancasila dan Lambangnya", semester: 1, jpEstimation: 16, grade: phase === "A" ? "1" : "3" },
        { code: "BAB 2", name: "Aturan dan Norma Hidup di Rumah/Sekolah", semester: 1, jpEstimation: 16, grade: phase === "A" ? "1" : "3" },
        { code: "BAB 3", name: "Bhinneka Tunggal Ika: Harmoni dalam Perbedaan", semester: 2, jpEstimation: 16, grade: phase === "A" ? "2" : "4" },
        { code: "BAB 4", name: "Gotong Royong dalam Menjaga Keutuhan NKRI", semester: 2, jpEstimation: 16, grade: phase === "A" ? "2" : "4" }
      );
    } else {
      list.push(
        { code: "BAB 1", name: "Pemahaman Literasi dan Menyimak Intensif", semester: 1, jpEstimation: 18, grade: "3" },
        { code: "BAB 2", name: "Mata Pelajaran Topik Dasar Semester 1", semester: 1, jpEstimation: 18, grade: "3" },
        { code: "BAB 3", name: "Pengamatan Kreatif dan Menulis Argumentatif", semester: 2, jpEstimation: 18, grade: "4" },
        { code: "BAB 4", name: "Review Kolaboratif Materi dan Presentasi Akhir", semester: 2, jpEstimation: 18, grade: "4" }
      );
    }
  } else if (jenjang === "SMP") {
    if (normalizedSubject.includes("matematika")) {
      list.push(
        // Kelas 7
        { code: "BAB 1", name: "Bilangan Bulat dan Pecahan (Operasi Hitung & Estimasi)", semester: 1, jpEstimation: 24, grade: "7" },
        { code: "BAB 2", name: "Aljabar (Bentuk, Operasi, dan Penyederhanaan Aljabar)", semester: 1, jpEstimation: 24, grade: "7" },
        { code: "BAB 3", name: "Persamaan dan Pertidaksamaan Linear Satu Variabel", semester: 2, jpEstimation: 24, grade: "7" },
        { code: "BAB 4", name: "Rasio, Perbandingan Senilai dan Berbalik Nilai", semester: 2, jpEstimation: 24, grade: "7" },
        // Kelas 8
        { code: "BAB 1", name: "Relasi dan Fungsi (Pemetaan, Grafik, dan Notasi)", semester: 1, jpEstimation: 24, grade: "8" },
        { code: "BAB 2", name: "Persamaan Garis Lurus (Gradien dan Grafik Koordinat)", semester: 1, jpEstimation: 24, grade: "8" },
        { code: "BAB 3", name: "Sistem Persamaan Linear Dua Variabel (SPLDV)", semester: 2, jpEstimation: 24, grade: "8" },
        { code: "BAB 4", name: "Teorema Pythagoras dan Penerapan Geometri Segitiga", semester: 2, jpEstimation: 24, grade: "8" },
        // Kelas 9
        { code: "BAB 1", name: "Perpangkatan dan Bentuk Akar (Sifat Eksponen dan Operasi)", semester: 1, jpEstimation: 24, grade: "9" },
        { code: "BAB 2", name: "Persamaan dan Fungsi Kuadrat (Akar-Akar dan Grafik Parabola)", semester: 1, jpEstimation: 24, grade: "9" },
        { code: "BAB 3", name: "Transformasi Geometri (Translasi, Refleksi, Rotasi, Dilatasi)", semester: 2, jpEstimation: 24, grade: "9" },
        { code: "BAB 4", name: "Kesebangunan dan Kekongruenan Bangun Datar dan Ruang", semester: 2, jpEstimation: 24, grade: "9" }
      );
    } else if (normalizedSubject.includes("pancasila")) {
      list.push(
        // Kelas 7
        { code: "BAB 1", name: "Sejarah Lahirnya Pancasila, Falsafah, dan Kedudukan Negara", semester: 1, jpEstimation: 16, grade: "7" },
        { code: "BAB 2", name: "Norma, Konstitusi, dan Hak-Kewajiban Warga Negara", semester: 1, jpEstimation: 18, grade: "7" },
        { code: "BAB 3", name: "Kesatuan Indonesia, Karakteristik Wilayah, dan Kearifan Lokal", semester: 2, jpEstimation: 16, grade: "7" },
        { code: "BAB 4", name: "Kebinekaan Indonesia dan Pembiasaan Toleransi Bernegara", semester: 2, jpEstimation: 16, grade: "7" },
        // Kelas 8
        { code: "BAB 1", name: "Kedudukan, Fungsi, dan Nilai-Nilai Luhur Pancasila", semester: 1, jpEstimation: 16, grade: "8" },
        { code: "BAB 2", name: "Bentuk Negara, Kedaulatan, dan Konstitusi Negara", semester: 1, jpEstimation: 18, grade: "8" },
        { code: "BAB 3", name: "Tata Negara, Lembaga Pemerintahan, dan Otonomi Daerah", semester: 2, jpEstimation: 16, grade: "8" },
        { code: "BAB 4", name: "Pembangunan Nasional dan Peran Pemuda dalam NKRI", semester: 2, jpEstimation: 16, grade: "8" },
        // Kelas 9
        { code: "BAB 1", name: "Penerapan Pancasila dari Masa ke Masa dan Dinamika Global", semester: 1, jpEstimation: 16, grade: "9" },
        { code: "BAB 2", name: "Hubungan Internasional, Politik Luar Negeri, dan Diplomasi", semester: 1, jpEstimation: 18, grade: "9" },
        { code: "BAB 3", name: "Kedaulatan Rakyat, Demokrasi Pancasila, dan Pemilu", semester: 2, jpEstimation: 16, grade: "9" },
        { code: "BAB 4", name: "Globalisasi, Dampak Sosial-Budaya, dan Identitas Nasional", semester: 2, jpEstimation: 16, grade: "9" }
      );
    } else if (normalizedSubject.includes("ipa")) {
      list.push(
        // Kelas 7
        { code: "BAB 1", name: "Hakikat Ilmu Sains, Pengukuran dan Metode Ilmiah", semester: 1, jpEstimation: 20, grade: "7" },
        { code: "BAB 2", name: "Zat, Wujud Zat dan Perubahan Fisika-Kimia", semester: 1, jpEstimation: 20, grade: "7" },
        { code: "BAB 3", name: "Suhu, Kalor, Pemuaian dan Alat Ukur Suhu", semester: 2, jpEstimation: 20, grade: "7" },
        { code: "BAB 4", name: "Gerak Lurus, Gaya, dan Hukum Newton", semester: 2, jpEstimation: 20, grade: "7" },
        // Kelas 8
        { code: "BAB 1", name: "Sel, Mikroskop, dan Struktur Organisasi Tubuh Manusia", semester: 1, jpEstimation: 20, grade: "8" },
        { code: "BAB 2", name: "Sistem Pencernaan, Peredaran Darah, dan Pernapasan Manusia", semester: 1, jpEstimation: 20, grade: "8" },
        { code: "BAB 3", name: "Usaha, Energi, Pesawat Sederhana dan Sistem Kerja Otot", semester: 2, jpEstimation: 20, grade: "8" },
        { code: "BAB 4", name: "Getaran, Gelombang, Alat Optik dan Cahaya dalam Kehidupan", semester: 2, jpEstimation: 20, grade: "8" },
        // Kelas 9
        { code: "BAB 1", name: "Sistem Reproduksi Manusia, Pembelahan Sel, dan Kesehatan", semester: 1, jpEstimation: 24, grade: "9" },
        { code: "BAB 2", name: "Pewarisan Sifat, Genetika Terapan, dan Bioteknologi", semester: 1, jpEstimation: 24, grade: "9" },
        { code: "BAB 3", name: "Listrik Statis, Dinamis, dan Hantaran Listrik Saraf", semester: 2, jpEstimation: 24, grade: "9" },
        { code: "BAB 4", name: "Kemagnetan, Induksi Elektromagnetik, dan Pemanfaatannya", semester: 2, jpEstimation: 24, grade: "9" }
      );
    } else {
      list.push(
        // Kelas 7
        { code: "BAB 1", name: "Konsep Inti Materi Kelas 7 Semester 1", semester: 1, jpEstimation: 18, grade: "7" },
        { code: "BAB 2", name: "Aktivitas Praktik Kolaboratif Kelas 7", semester: 1, jpEstimation: 18, grade: "7" },
        { code: "BAB 3", name: "Konsep Inti Materi Kelas 7 Semester 2", semester: 2, jpEstimation: 18, grade: "7" },
        { code: "BAB 4", name: "Penerapan Projek Nyata Terapan Kelas 7", semester: 2, jpEstimation: 18, grade: "7" },
        // Kelas 8
        { code: "BAB 1", name: "Konsep Inti Materi Kelas 8 Semester 1", semester: 1, jpEstimation: 18, grade: "8" },
        { code: "BAB 2", name: "Aktivitas Praktik Kolaboratif Kelas 8", semester: 1, jpEstimation: 18, grade: "8" },
        { code: "BAB 3", name: "Konsep Inti Materi Kelas 8 Semester 2", semester: 2, jpEstimation: 18, grade: "8" },
        { code: "BAB 4", name: "Penerapan Projek Nyata Terapan Kelas 8", semester: 2, jpEstimation: 18, grade: "8" },
        // Kelas 9
        { code: "BAB 1", name: "Konsep Inti Materi Kelas 9 Semester 1", semester: 1, jpEstimation: 24, grade: "9" },
        { code: "BAB 2", name: "Aktivitas Praktik Kolaboratif Kelas 9", semester: 1, jpEstimation: 24, grade: "9" },
        { code: "BAB 3", name: "Konsep Inti Materi Kelas 9 Semester 2", semester: 2, jpEstimation: 24, grade: "9" },
        { code: "BAB 4", name: "Penerapan Projek Nyata Terapan Kelas 9", semester: 2, jpEstimation: 24, grade: "9" }
      );
    }
  } else {
    // SMA or SMK presets
    if (normalizedSubject.includes("matematika")) {
      list.push(
        { code: "BAB 1", name: "Eksponen, Logaritma, dan Persamaan Kuadrat", semester: 1, jpEstimation: 24, grade: "10" },
        { code: "BAB 2", name: "Sistem Persamaan dan Pertidaksamaan Linear Dua Variabel", semester: 1, jpEstimation: 24, grade: "10" },
        { code: "BAB 3", name: "Trigonometri Dasar dan Perbandingan Segitiga Siku-Siku", semester: 2, jpEstimation: 24, grade: "11" },
        { code: "BAB 4", name: "Statistika Penyajian Data dan Analisis Diagram Pencar", semester: 2, jpEstimation: 24, grade: "11" }
      );
    } else if (normalizedSubject.includes("fisika")) {
      list.push(
        { code: "BAB 1", name: "Metode Ilmiah dan Pengukuran Fisika", semester: 1, jpEstimation: 20, grade: "10" },
        { code: "BAB 2", name: "Kinematika Gerak Lurus dan Melingkar", semester: 1, jpEstimation: 22, grade: "10" },
        { code: "BAB 3", name: "Hukum Newton tentang Gerak dan Gravitasi", semester: 2, jpEstimation: 20, grade: "11" },
        { code: "BAB 4", name: "Energi Terbarukan dan Dampak Lingkungan", semester: 2, jpEstimation: 22, grade: "11" }
      );
    } else {
      list.push(
        { code: "BAB 1", name: "Struktur Komprehensif Semester 1", semester: 1, jpEstimation: 24, grade: "10" },
        { code: "BAB 2", name: "Penerapan Industri & Kajian Teoris", semester: 1, jpEstimation: 24, grade: "10" },
        { code: "BAB 3", name: "Struktur Komprehensif Semester 2", semester: 2, jpEstimation: 24, grade: "11" },
        { code: "BAB 4", name: "Evaluasi Komprehensif & Ujian Ketercapaian", semester: 2, jpEstimation: 24, grade: "11" }
      );
    }
  }

  let result = list.map((item, idx) => ({
    id: `${item.code.replace(/\s+/g, "_")}_${item.grade || "7"}_${idx}_${Date.now() % 1000}`,
    code: item.code,
    name: item.name,
    semester: item.semester,
    jpEstimation: item.jpEstimation,
    grade: item.grade,
  }));

  if (selectedGrades && selectedGrades.length > 0) {
    result = result.filter(item => !item.grade || selectedGrades.includes(item.grade));
  }

  return result;
};

