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
  return snapshot.docs.map((d) => ({ uid: d.id, ...(d.data() as Record<string, unknown>) } as AstrologerType));
};

export const getAstrologerById = async (uid: string): Promise<AstrologerType | null> => {
  const docRef = doc(db, "astrologers", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data() as Omit<AstrologerType, 'uid'> & { [k: string]: unknown };
    return { uid: docSnap.id, ...data } as AstrologerType;
  }
  return null;
};

export const getAllAstrologers = async (): Promise<AstrologerType[]> => {
  // Read public astrologer profiles from the astrologers collection.
  // Firestore rules allow public reads on /astrologers.
  const q = query(astrologersRef);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({ uid: d.id, ...(d.data() as Record<string, unknown>) } as AstrologerType));
};

export const updateAstrologerProfile = async (uid: string, data: Partial<AstrologerType>) => {
  const ref = doc(db, "astrologers", uid);
  // Use setDoc with merge to both create and update in one call. This aligns with
  // security rules that allow owners to create or update their profile (with
  // protected-field checks).
  await setDoc(ref, data, { merge: true });
};
