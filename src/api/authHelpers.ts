import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { AppUser } from './types';

export const onLoginCreateUser = async (firebaseUser: any): Promise<AppUser> => {
  if (!firebaseUser) throw new Error('No firebase user provided');

  const userRef = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    return { id: snap.id, ...(snap.data() as any) };
  }

  const userData: Partial<AppUser> = {
    name: firebaseUser.displayName ?? '',
    email: firebaseUser.email ?? '',
    role: 'user',
    createdAt: serverTimestamp(),
  };

  await setDoc(userRef, userData);

  return { id: firebaseUser.uid, ...userData } as AppUser;
};
