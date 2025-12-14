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
