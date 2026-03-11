import api from "@/lib/api";
import { User, LoginInput, SignupInput } from "@/types";
import { auth } from "@/lib/firebase/config";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
} from "firebase/auth";

export const authService = {
  login: async (data: LoginInput) => {
    const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
    return userCredential.user;
  },

  signup: async (data: SignupInput) => {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    if (data.username) {
      await updateProfile(userCredential.user, { displayName: data.username });
    }
    
    // Also notify our backend to create user profile in Firestore simulation
    await api.post("/auth/signup", {
      uid: userCredential.user.uid,
      email: data.email,
      username: data.username
    });

    return userCredential.user;
  },

  logout: async () => {
    await signOut(auth);
  },

  getCurrentUser: async (token: string) => {
    const response = await api.get<User>("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
};
