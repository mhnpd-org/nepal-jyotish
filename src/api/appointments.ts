import { db } from "./firebase";
import { collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import type { Appointment as AppointmentType, AppointmentComment } from "./types";

const appointmentsRef = collection(db, "appointments");

// Generate Jitsi meeting link
const generateMeetingLink = (appointmentId: string) => {
  return `https://meet.jit.si/nepal-jotish-${appointmentId}`;
};

export const createAppointment = async (appointmentData: Omit<AppointmentType, 'id' | 'createdAt' | 'updatedAt' | 'meetingLink'>): Promise<string> => {
  const docRef = await addDoc(appointmentsRef, {
    ...appointmentData,
    status: appointmentData.status || 'pending',
    comments: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Generate and update meeting link
  const meetingLink = generateMeetingLink(docRef.id);
  await updateDoc(docRef, { meetingLink });

  return docRef.id;
};

export const getAppointmentById = async (id: string): Promise<AppointmentType | null> => {
  const docRef = doc(db, "appointments", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data() as Omit<AppointmentType, 'id'> & { [k: string]: unknown };
    return { id: docSnap.id, ...data } as AppointmentType;
  }
  return null;
};

export const getUserAppointments = async (userId: string): Promise<AppointmentType[]> => {
  const q = query(appointmentsRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) } as AppointmentType));
};

export const getAstrologerAppointments = async (astrologerId: string): Promise<AppointmentType[]> => {
  const q = query(appointmentsRef, where("astrologerId", "==", astrologerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) } as AppointmentType));
};

export const getAllAppointments = async (): Promise<AppointmentType[]> => {
  const snapshot = await getDocs(appointmentsRef);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) } as AppointmentType));
};

export const addComment = async (appointmentId: string, comment: AppointmentComment) => {
  await updateDoc(doc(db, "appointments", appointmentId), {
    comments: arrayUnion(comment),
    updatedAt: serverTimestamp(),
  });
};

export const updateAppointmentStatus = async (appointmentId: string, status: AppointmentType['status']) => {
  await updateDoc(doc(db, "appointments", appointmentId), {
    status,
    updatedAt: serverTimestamp(),
  });
};

export const updateAppointmentSchedule = async (appointmentId: string, scheduledDate: string, scheduledTime: string) => {
  await updateDoc(doc(db, "appointments", appointmentId), {
    scheduledDate,
    scheduledTime,
    updatedAt: serverTimestamp(),
  });
};

// Get booked time slots for a specific astrologer on a specific date
export const getBookedTimeSlots = async (astrologerId: string, date: string): Promise<string[]> => {
  const q = query(
    appointmentsRef,
    where("astrologerId", "==", astrologerId),
    where("scheduledDate", "==", date),
    where("status", "in", ["pending", "confirmed"]) // Only count pending and confirmed appointments
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data().scheduledTime as string);
};
