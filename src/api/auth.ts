import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async (): Promise<User> => {
  const result = await signInWithPopup(auth, provider);
  return result.user;
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
