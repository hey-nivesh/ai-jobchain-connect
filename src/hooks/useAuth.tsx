import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signup = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};