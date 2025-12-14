import { db } from "./firebase";
import { doc, updateDoc } from "firebase/firestore";

export const verifyAstrologer = async (astrologerId: string) => {
  const astroDoc = doc(db, "astrologers", astrologerId);
  await updateDoc(astroDoc, { verified: true });
};

export const promoteUserToAstrologer = async (userId: string) => {
  const userDoc = doc(db, "users", userId);
  await updateDoc(userDoc, { role: "astrologer" });
};

// --- Additional admin helpers ---
import { collection, query, where, getDocs } from "firebase/firestore";
import type { AppUser } from "./types";

export const getUserByEmail = async (email: string): Promise<AppUser | null> => {
  if (!email) return null;
  const q = query(collection(db, "users"), where("email", "==", email.toLowerCase()));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as any) } as AppUser;
};

export const updateUserById = async (uid: string, updates: Partial<AppUser>) => {
  if (!uid || !updates) throw new Error("Invalid input");
  await updateDoc(doc(db, "users", uid), updates as any);
};

export const getAllAstrologers = async (): Promise<AppUser[]> => {
  const q = query(collection(db, "users"), where("role", "==", "astrologer"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
};

export const getAllAppointments = async () => {
  const snap = await getDocs(collection(db, 'appointments'));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
};

