import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, DocumentSnapshot, DocumentData} from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { User } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const createUserProfile = async (user: FirebaseUser) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      const newProfile: Omit<User, 'id'> = {
        email: user.email || '',
        displayName: user.displayName || '',
        theme: 'light',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        level: 1,
        totalXP: 0,
        health: 100,
        energy: 100,
        stats: {
          discipline: 10,
          consistency: 10,
          resilience: 10
        },
        badges: [],
        createdAt: new Date() as any
      };
      
      await setDoc(userRef, newProfile);
      setUserProfile({ ...newProfile, id: user.uid });
    } else {
      setUserProfile({ ...userSnap.data(), id: user.uid } as User);
    }
  };

  const signup = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(result.user);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await createUserProfile(result.user);
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

useEffect(() => {
  const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
    setCurrentUser(user);

    if (user) {
      await createUserProfile(user); // garante que o perfil exista

      // 🔄 Atualiza o userProfile em tempo real
      const userRef = doc(db, 'users', user.uid);
      const unsubscribeProfile = onSnapshot(userRef, (docSnap: DocumentSnapshot<DocumentData>) => {
  const data = docSnap.data();
  setUserProfile(data ? (data as User) : null);
});


      // Clean up o snapshot listener quando deslogar
      return () => {
        unsubscribeProfile();
      };
    } else {
      setUserProfile(null);
    }

    setLoading(false);
  });

  return unsubscribeAuth;
}, []);


  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    login,
    loginWithGoogle,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};