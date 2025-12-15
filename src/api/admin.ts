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
import type { AppUser, Appointment } from "./types";

export const getUserByEmail = async (email: string): Promise<AppUser | null> => {
  if (!email) return null;
  const q = query(collection(db, "users"), where("email", "==", email.toLowerCase()));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  const data = d.data() as Omit<AppUser, 'uid'> & { [k: string]: unknown };
  return { uid: d.id, ...data } as AppUser;
};

export const updateUserById = async (uid: string, updates: Partial<AppUser>): Promise<void> => {
  if (!uid || !updates) throw new Error("Invalid input");
  await updateDoc(doc(db, "users", uid), updates as Partial<Record<string, unknown>>);
};

export const getAllAstrologers = async (): Promise<AppUser[]> => {
  const q = query(collection(db, "users"), where("role", "==", "astrologer"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ uid: d.id, ...(d.data() as Record<string, unknown>) } as AppUser));
};

export const getAllAppointments = async (): Promise<Appointment[]> => {
  const snap = await getDocs(collection(db, 'appointments'));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, unknown>) } as Appointment));
};

