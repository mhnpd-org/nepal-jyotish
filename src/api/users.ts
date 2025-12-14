import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { AppUser } from "./types";

export const getUserById = async (uid: string): Promise<AppUser | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return { uid: docSnap.id, ...(docSnap.data() as any) };
  return null;
};

export const createOrUpdateUser = async (uid: string, data: Partial<AppUser>) => {
  await setDoc(doc(db, "users", uid), data, { merge: true });
};
