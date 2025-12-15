import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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

export const updateMyUserProfile = async (uid: string, data: Partial<Pick<AppUser, 'name'>>) => {
  if (!uid) throw new Error('Invalid uid');
  await updateDoc(doc(db, 'users', uid), data as any);
};
