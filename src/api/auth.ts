import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";
import { onLoginCreateUser } from "./authHelpers";

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async (): Promise<User> => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  // ensure Firestore user doc exists (idempotent)
  try {
    await onLoginCreateUser(user);
  } catch (err) {
    // don't block login on Firestore errors, but surface in console

    console.error('onLoginCreateUser failed', err);
  }

  return user;
};

export const logout = async () => signOut(auth);

export const isLogin = () => !!auth.currentUser;

export const isLoginAsync = (): Promise<boolean> =>
  new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(!!user);
    });
  });

export const getCurrentUser = (): User | null => auth.currentUser;
