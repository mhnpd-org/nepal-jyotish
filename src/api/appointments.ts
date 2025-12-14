import { db } from "./firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

export type Appointment = {
  id?: string;
  userId: string;
  astrologerId: string;
  datetime: string; // ISO string
  status: "pending" | "confirmed" | "completed";
  callRoomId?: string;
  [k: string]: any;
};

const appointmentsRef = collection(db, "appointments");

export const bookAppointment = async (
  userId: string,
  astrologerId: string,
  datetime: string,
  callRoomId?: string
) => {
  const docRef = await addDoc(appointmentsRef, {
    userId,
    astrologerId,
    datetime,
    status: "pending",
    callRoomId: callRoomId || null,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
};

export const getUserAppointments = async (userId: string): Promise<Appointment[]> => {
  const q = query(appointmentsRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
};

export const getAstrologerAppointments = async (astrologerId: string): Promise<Appointment[]> => {
  const q = query(appointmentsRef, where("astrologerId", "==", astrologerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
};

export const getAllAppointments = async (): Promise<Appointment[]> => {
  const snapshot = await getDocs(appointmentsRef);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
};
