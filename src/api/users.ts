import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import type { AppUser } from "./types";

export const getUserById = async (uid: string): Promise<AppUser | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data() as Omit<AppUser, 'uid'> & { [k: string]: unknown };
    return { uid: docSnap.id, ...data } as AppUser;
  }
  return null;
};

export const createOrUpdateUser = async (uid: string, data: Partial<AppUser>): Promise<void> => {
  await setDoc(doc(db, "users", uid), data, { merge: true });
};

export const updateMyUserProfile = async (uid: string, data: Partial<Pick<AppUser, 'name'>>): Promise<void> => {
  if (!uid) throw new Error('Invalid uid');
  await updateDoc(doc(db, 'users', uid), data as Partial<Record<string, unknown>>);
};
