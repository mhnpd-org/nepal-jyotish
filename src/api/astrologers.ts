import { db } from "./firebase";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import type { Astrologer as AstrologerType } from "./types";

const astrologersRef = collection(db, "astrologers");

export const createOrUpdateAstrologer = async (uid: string, data: Partial<AstrologerType>) => {
  await setDoc(doc(db, "astrologers", uid), data, { merge: true });
};

export const getVerifiedAstrologers = async (): Promise<AstrologerType[]> => {
  const q = query(astrologersRef, where("verified", "==", true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ uid: d.id, ...(d.data() as any) }));
};

export const getAstrologerById = async (uid: string): Promise<AstrologerType | null> => {
  const docRef = doc(db, "astrologers", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return { uid: docSnap.id, ...(docSnap.data() as any) };
  return null;
};
