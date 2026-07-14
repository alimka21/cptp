import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  SesiKurikulum,
  SesiIdentitas,
  SesiKalender,
  SesiBab,
  SesiTp,
  SesiAtp,
  SesiKktp,
  SesiCp
} from "../types/sesiKurikulum";
import { getCalculatedIntrakurikulerJP } from "../data/intrakurikulerJP";

// Define the action interfaces
type SesiAction =
  | { type: "UPDATE_IDENTITAS"; payload: Partial<SesiIdentitas> }
  | { type: "UPDATE_KALENDER"; payload: Partial<SesiKalender> }
  | { type: "ADD_BAB"; payload: SesiBab }
  | { type: "UPDATE_BAB"; payload: { id: string; fields: Partial<SesiBab> } }
  | { type: "DELETE_BAB"; payload: string }
  | { type: "SET_BABS"; payload: SesiBab[] }
  | { type: "ADD_TP"; payload: SesiTp }
  | { type: "UPDATE_TP"; payload: { id: string; fields: Partial<SesiTp> } }
  | { type: "DELETE_TP"; payload: string }
  | { type: "SET_TPS"; payload: SesiTp[] }
  | { type: "REORDER_ATP"; payload: { index: number; direction: "up" | "down" } }
  | { type: "SET_ELEMENTS"; payload: Array<{ name: string; cpText: string }> }
  | { type: "UPDATE_TP_TEXT"; payload: { id: string; text: string } };

// Initial sub-elements
const initialIdentitas: SesiIdentitas = {
  sekolah: "",
  npsn: "",
  guru: "",
  nip: "",
  kepalaSekolah: "",
  nipKepalaSekolah: "",
  tahunPelajaran: "2026/2027",
  jenjang: "SMP",
  kelas: ["7"],
  fase: "D",
  mapel: "Matematika",
  // support legacy
  schoolName: "",
  author: "",
  academicYear: "2026/2027",
  schoolAddress: "",
  curriculumName: "Kurikulum Nasional",
  jpPerWeek: 4,
  weeksSemester1: 18,
  weeksSemester2: 16,
  tpPerBab: 2,
  jpSumatifPerBab: 4,
  subject: "Matematika",
  phase: "D",
  grades: ["7"]
};

const initialKalender: SesiKalender = {
  bulanList: [
    { bulan: "Juli", jmlMinggu: 4 },
    { bulan: "Agustus", jmlMinggu: 4 },
    { bulan: "September", jmlMinggu: 4 },
    { bulan: "Oktober", jmlMinggu: 4 },
    { bulan: "November", jmlMinggu: 4 },
    { bulan: "Desember", jmlMinggu: 4 },
    { bulan: "Januari", jmlMinggu: 4 },
    { bulan: "Februari", jmlMinggu: 4 },
    { bulan: "Maret", jmlMinggu: 4 },
    { bulan: "April", jmlMinggu: 4 },
    { bulan: "Mei", jmlMinggu: 4 },
    { bulan: "Juni", jmlMinggu: 4 }
  ],
  mingguTidakEfektif: [
    { kegiatan: "Libur Semester 1", jmlMinggu: 2, bulan: "Desember" },
    { kegiatan: "Libur Semester 2", jmlMinggu: 2, bulan: "Juni" }
  ],
  jpPerMinggu: 18,
  mingguEfektifTerhitung: 34,
  jpEfektifTerhitung: 612
};

const initialState: SesiKurikulum = {
  identitas: initialIdentitas,
  kalender: initialKalender,
  bab: [],
  cp: {
    fase: "F",
    elemen: []
  },
  tp: [],
  atp: [],
  kktp: []
};

// Helper to compute calendar details on changes
function recalculateKalender(identitas: SesiIdentitas, kalender: SesiKalender): SesiKalender {
  const ws1 = identitas.weeksSemester1 ?? 18;
  const ws2 = identitas.weeksSemester2 ?? 16;
  const jp = identitas.jpPerWeek ?? 18;

  const totalEffWeeks = ws1 + ws2;
  const totalEffJp = totalEffWeeks * jp;

  return {
    ...kalender,
    jpPerMinggu: jp,
    mingguEfektifTerhitung: totalEffWeeks,
    jpEfektifTerhitung: totalEffJp
  };
}

// REDUCER
function sesiReducer(state: SesiKurikulum, action: SesiAction): SesiKurikulum {
  switch (action.type) {
    case "UPDATE_IDENTITAS": {
      const mergedIdentitas = { ...state.identitas, ...action.payload };
      let cp = state.cp;
      
      // Sync legacy properties safely by checking which field actually changed compared to state.identitas
      // 1. sekolah vs schoolName
      if (action.payload.sekolah !== undefined && action.payload.sekolah !== state.identitas.sekolah) {
        mergedIdentitas.schoolName = action.payload.sekolah;
        mergedIdentitas.sekolah = action.payload.sekolah;
      } else if (action.payload.schoolName !== undefined && action.payload.schoolName !== state.identitas.schoolName) {
        mergedIdentitas.sekolah = action.payload.schoolName;
        mergedIdentitas.schoolName = action.payload.schoolName;
      }

      // 2. guru vs author
      if (action.payload.guru !== undefined && action.payload.guru !== state.identitas.guru) {
        mergedIdentitas.author = action.payload.guru;
        mergedIdentitas.guru = action.payload.guru;
      } else if (action.payload.author !== undefined && action.payload.author !== state.identitas.author) {
        mergedIdentitas.guru = action.payload.author;
        mergedIdentitas.author = action.payload.author;
      }

      // 3. tahunPelajaran vs academicYear
      if (action.payload.tahunPelajaran !== undefined && action.payload.tahunPelajaran !== state.identitas.tahunPelajaran) {
        mergedIdentitas.academicYear = action.payload.tahunPelajaran;
        mergedIdentitas.tahunPelajaran = action.payload.tahunPelajaran;
      } else if (action.payload.academicYear !== undefined && action.payload.academicYear !== state.identitas.academicYear) {
        mergedIdentitas.tahunPelajaran = action.payload.academicYear;
        mergedIdentitas.academicYear = action.payload.academicYear;
      }

      // 4. mapel vs subject
      if (action.payload.mapel !== undefined && action.payload.mapel !== state.identitas.mapel) {
        mergedIdentitas.subject = action.payload.mapel;
        mergedIdentitas.mapel = action.payload.mapel;
      } else if (action.payload.subject !== undefined && action.payload.subject !== state.identitas.subject) {
        mergedIdentitas.mapel = action.payload.subject;
        mergedIdentitas.subject = action.payload.subject;
      }

      // 5. fase vs phase
      if (action.payload.fase !== undefined && action.payload.fase !== state.identitas.fase) {
        mergedIdentitas.phase = action.payload.fase;
        mergedIdentitas.fase = action.payload.fase;
        cp = { ...state.cp, fase: action.payload.fase };
      } else if (action.payload.phase !== undefined && action.payload.phase !== state.identitas.phase) {
        mergedIdentitas.fase = action.payload.phase;
        mergedIdentitas.phase = action.payload.phase;
        cp = { ...state.cp, fase: action.payload.phase };
      }

      // 6. kelas vs grades
      if (action.payload.kelas !== undefined && JSON.stringify(action.payload.kelas) !== JSON.stringify(state.identitas.kelas)) {
        mergedIdentitas.grades = action.payload.kelas;
        mergedIdentitas.kelas = action.payload.kelas;
      } else if (action.payload.grades !== undefined && JSON.stringify(action.payload.grades) !== JSON.stringify(state.identitas.grades)) {
        mergedIdentitas.kelas = action.payload.grades;
        mergedIdentitas.grades = action.payload.grades;
      }

      // Auto-calculate standard JP values under Permendikbudristek 12 Tahun 2024 if level/grade/subject changed and not manually overridden
      const levelsChanged = (action.payload.jenjang !== undefined && action.payload.jenjang !== state.identitas.jenjang) ||
                            (action.payload.kelas !== undefined && JSON.stringify(action.payload.kelas) !== JSON.stringify(state.identitas.kelas)) ||
                            (action.payload.grades !== undefined && JSON.stringify(action.payload.grades) !== JSON.stringify(state.identitas.grades)) ||
                            (action.payload.mapel !== undefined && action.payload.mapel !== state.identitas.mapel) ||
                            (action.payload.subject !== undefined && action.payload.subject !== state.identitas.subject) ||
                            (action.payload.phase !== undefined && action.payload.phase !== state.identitas.phase);

      if (levelsChanged) {
        const targetGrade = mergedIdentitas.grades?.[0] || mergedIdentitas.kelas?.[0] || "";
        const targetSubject = mergedIdentitas.subject || mergedIdentitas.mapel || "Matematika";
        const targetJenjang = mergedIdentitas.jenjang || "SMP";

        if (action.payload.jpPerWeek === undefined) {
          const calculated = getCalculatedIntrakurikulerJP(targetJenjang, targetGrade, targetSubject);
          mergedIdentitas.jpPerWeek = calculated.jpPerWeek;
          
          if (action.payload.weeksSemester1 === undefined && action.payload.weeksSemester2 === undefined) {
            const totalWeeks = calculated.weeksAssumed; // e.g. 36 or 32
            mergedIdentitas.weeksSemester1 = Math.ceil(totalWeeks / 2); // 18 or 16
            mergedIdentitas.weeksSemester2 = Math.floor(totalWeeks / 2); // 18 or 16
          }
        }
      }

      if (action.payload.jpPerWeek !== undefined) mergedIdentitas.jpPerWeek = action.payload.jpPerWeek;
      if (action.payload.weeksSemester1 !== undefined) mergedIdentitas.weeksSemester1 = action.payload.weeksSemester1;
      if (action.payload.weeksSemester2 !== undefined) mergedIdentitas.weeksSemester2 = action.payload.weeksSemester2;

      const updatedKalender = recalculateKalender(mergedIdentitas, state.kalender);

      return {
        ...state,
        identitas: mergedIdentitas,
        kalender: updatedKalender,
        cp
      };
    }

    case "UPDATE_KALENDER": {
      const mergedKalender = { ...state.kalender, ...action.payload };
      return {
        ...state,
        kalender: mergedKalender
      };
    }

    case "SET_ELEMENTS": {
      return {
        ...state,
        cp: {
          ...state.cp,
          elemen: action.payload
        }
      };
    }

    case "ADD_BAB": {
      const newBab = action.payload;
      return {
        ...state,
        bab: [...state.bab, newBab]
      };
    }

    case "UPDATE_BAB": {
      const { id, fields } = action.payload;
      const updatedBab = state.bab.map((b) => {
        if (b.id === id) {
          const merged = { ...b, ...fields };
          // Sync compatibility properties
          if (fields.noBab !== undefined) merged.code = fields.noBab;
          if (fields.code !== undefined) merged.noBab = fields.code;
          if (fields.judul !== undefined) merged.name = fields.judul;
          if (fields.name !== undefined) merged.judul = fields.name;
          if (fields.jpAlokasi !== undefined) merged.jpEstimation = fields.jpAlokasi;
          if (fields.jpEstimation !== undefined) merged.jpAlokasi = fields.jpEstimation;
          return merged;
        }
        return b;
      });
      return {
        ...state,
        bab: updatedBab
      };
    }

    case "DELETE_BAB": {
      return {
        ...state,
        bab: state.bab.filter((b) => b.id !== action.payload)
      };
    }

    case "SET_BABS": {
      const mapped = action.payload.map((b) => {
        const merged = { ...b };
        if (!merged.noBab && merged.code) merged.noBab = merged.code;
        if (!merged.judul && merged.name) merged.judul = merged.name;
        if (!merged.code && merged.noBab) merged.code = merged.noBab;
        if (!merged.name && merged.judul) merged.name = merged.judul;
        if (merged.jpEstimation !== undefined && merged.jpAlokasi === undefined) merged.jpAlokasi = merged.jpEstimation;
        if (merged.jpAlokasi !== undefined && merged.jpEstimation === undefined) merged.jpEstimation = merged.jpAlokasi;
        return merged;
      });
      return {
        ...state,
        bab: mapped
      };
    }

    case "ADD_TP": {
      const newTp = action.payload;
      return {
        ...state,
        tp: [...state.tp, newTp]
      };
    }

    case "UPDATE_TP": {
      const { id, fields } = action.payload;
      const updatedTp = state.tp.map((t) => {
        if (t.id === id) {
          const merged = { ...t, ...fields };
          // Sync compatibility properties
          if (fields.kalimatTP !== undefined) merged.text = fields.kalimatTP;
          if (fields.text !== undefined) merged.kalimatTP = fields.text;
          if (fields.elemenRef !== undefined) merged.element = fields.elemenRef;
          if (fields.element !== undefined) merged.elemenRef = fields.element;
          if (fields.kko !== undefined) merged.competency = fields.kko;
          if (fields.competency !== undefined) merged.kko = fields.competency;
          if (fields.jpAlokasi !== undefined) merged.jp = fields.jpAlokasi;
          if (fields.jp !== undefined) merged.jpAlokasi = fields.jp;
          if (fields.babRef !== undefined) merged.babCode = fields.babRef;
          if (fields.babCode !== undefined) merged.babRef = fields.babCode;
          return merged;
        }
        return t;
      });
      return {
        ...state,
        tp: updatedTp
      };
    }

    case "DELETE_TP": {
      return {
        ...state,
        tp: state.tp.filter((t) => t.id !== action.payload)
      };
    }

    case "SET_TPS": {
      const mapped = action.payload.map((t) => {
        const merged = { ...t };
        if (!merged.kalimatTP && merged.text) merged.kalimatTP = merged.text;
        if (!merged.text && merged.kalimatTP) merged.text = merged.kalimatTP;
        if (!merged.elemenRef && merged.element) merged.elemenRef = merged.element;
        if (!merged.element && merged.elemenRef) merged.element = merged.elemenRef;
        if (!merged.kko && merged.competency) merged.kko = merged.competency;
        if (!merged.competency && merged.kko) merged.competency = merged.kko;
        if (merged.jp !== undefined && merged.jpAlokasi === undefined) merged.jpAlokasi = merged.jp;
        if (merged.jpAlokasi !== undefined && merged.jp === undefined) merged.jp = merged.jpAlokasi;
        if (!merged.babRef && merged.babCode) merged.babRef = merged.babCode;
        if (!merged.babCode && merged.babRef) merged.babCode = merged.babRef;
        return merged;
      });
      return {
        ...state,
        tp: mapped
      };
    }

    case "REORDER_ATP": {
      const { index, direction } = action.payload;
      if (direction === "up" && index === 0) return state;
      if (direction === "down" && index === state.tp.length - 1) return state;

      const listCopy = [...state.tp];
      const targetIdx = direction === "up" ? index - 1 : index + 1;
      const temp = listCopy[index];
      listCopy[index] = listCopy[targetIdx];
      listCopy[targetIdx] = temp;

      return {
        ...state,
        tp: listCopy
      };
    }

    case "UPDATE_TP_TEXT": {
      const { id, text } = action.payload;
      return {
        ...state,
        tp: state.tp.map((t) => (t.id === id ? { ...t, text, kalimatTP: text } : t))
      };
    }

    default:
      return state;
  }
}

// CONTEXT CREATION
interface SesiKurikulumContextType {
  state: SesiKurikulum;
  updateIdentitas: (payload: Partial<SesiIdentitas>) => void;
  updateKalender: (payload: Partial<SesiKalender>) => void;
  addBab: (payload: SesiBab) => void;
  updateBab: (id: string, fields: Partial<SesiBab>) => void;
  deleteBab: (id: string) => void;
  setBabs: (payload: SesiBab[] | ((prev: SesiBab[]) => SesiBab[])) => void;
  addTP: (payload: SesiTp) => void;
  updateTP: (id: string, fields: Partial<SesiTp>) => void;
  deleteTP: (id: string) => void;
  setTps: (payload: SesiTp[] | ((prev: SesiTp[]) => SesiTp[])) => void;
  reorderATP: (index: number, direction: "up" | "down") => void;
  setElements: (payload: Array<{ name: string; cpText: string }> | ((prev: Array<{ name: string; cpText: string }>) => Array<{ name: string; cpText: string }>)) => void;
  updateTPText: (id: string, text: string) => void;
}

const SesiKurikulumContext = createContext<SesiKurikulumContextType | undefined>(undefined);

// PROVIDER COMPONENT
export function SesiKurikulumProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sesiReducer, initialState);

  // Dispatch helper wrappers
  const updateIdentitas = (payload: Partial<SesiIdentitas>) => {
    dispatch({ type: "UPDATE_IDENTITAS", payload });
  };

  const updateKalender = (payload: Partial<SesiKalender>) => {
    dispatch({ type: "UPDATE_KALENDER", payload });
  };

  const addBab = (payload: SesiBab) => {
    dispatch({ type: "ADD_BAB", payload });
  };

  const updateBab = (id: string, fields: Partial<SesiBab>) => {
    dispatch({ type: "UPDATE_BAB", payload: { id, fields } });
  };

  const deleteBab = (id: string) => {
    dispatch({ type: "DELETE_BAB", payload: id });
  };

  const setBabs = (payload: SesiBab[] | ((prev: SesiBab[]) => SesiBab[])) => {
    if (typeof payload === "function") {
      dispatch({ type: "SET_BABS", payload: payload(state.bab) });
    } else {
      dispatch({ type: "SET_BABS", payload });
    }
  };

  const addTP = (payload: SesiTp) => {
    dispatch({ type: "ADD_TP", payload });
  };

  const updateTP = (id: string, fields: Partial<SesiTp>) => {
    dispatch({ type: "UPDATE_TP", payload: { id, fields } });
  };

  const deleteTP = (id: string) => {
    dispatch({ type: "DELETE_TP", payload: id });
  };

  const setTps = (payload: SesiTp[] | ((prev: SesiTp[]) => SesiTp[])) => {
    if (typeof payload === "function") {
      dispatch({ type: "SET_TPS", payload: payload(state.tp) });
    } else {
      dispatch({ type: "SET_TPS", payload });
    }
  };

  const reorderATP = (index: number, direction: "up" | "down") => {
    dispatch({ type: "REORDER_ATP", payload: { index, direction } });
  };

  const setElements = (payload: Array<{ name: string; cpText: string }> | ((prev: Array<{ name: string; cpText: string }>) => Array<{ name: string; cpText: string }>)) => {
    if (typeof payload === "function") {
      dispatch({ type: "SET_ELEMENTS", payload: payload(state.cp.elemen) });
    } else {
      dispatch({ type: "SET_ELEMENTS", payload });
    }
  };

  const updateTPText = (id: string, text: string) => {
    dispatch({ type: "UPDATE_TP_TEXT", payload: { id, text } });
  };

  return (
    <SesiKurikulumContext.Provider
      value={{
        state,
        updateIdentitas,
        updateKalender,
        addBab,
        updateBab,
        deleteBab,
        setBabs,
        addTP,
        updateTP,
        deleteTP,
        setTps,
        reorderATP,
        setElements,
        updateTPText
      }}
    >
      {children}
    </SesiKurikulumContext.Provider>
  );
}

// CUSTOM HOOK
export function useSesiKurikulum() {
  const context = useContext(SesiKurikulumContext);
  if (!context) {
    throw new Error("useSesiKurikulum must be used within a SesiKurikulumProvider");
  }
  return context;
}
