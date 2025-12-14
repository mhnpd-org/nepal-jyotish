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

export const getAllAstrologers = async (): Promise<AstrologerType[]> => {
  // Query users collection for users with role 'astrologer'
  const usersQuery = query(collection(db, "users"), where("role", "==", "astrologer"));
  const usersSnapshot = await getDocs(usersQuery);

  // Fetch all astrologer profile data in parallel
  const astrologerPromises = usersSnapshot.docs.map(async (userDoc) => {
    const uid = userDoc.id;
    const userData = userDoc.data();

    // Try to get astrologer profile from astrologers collection
    const astroDoc = await getDoc(doc(db, "astrologers", uid));
    const astroData = astroDoc.exists() ? astroDoc.data() : {};

    // Merge user data with astrologer profile data
    return {
      uid,
      name: userData.name,
      email: userData.email,
      ...astroData,
    } as AstrologerType;
  });

  return Promise.all(astrologerPromises);
};

export const updateAstrologerProfile = async (uid: string, data: Partial<AstrologerType>) => {
  await setDoc(doc(db, "astrologers", uid), data, { merge: true });
};
