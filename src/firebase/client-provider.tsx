'use client';

import React, { useMemo, type ReactNode, useEffect } from 'react';
import { FirebaseProvider, useUser } from '@/firebase/provider';
import { initializeFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

function NewUserInitializer() {
  const { user, isUserLoading } = useUser();
  const { firestore } = initializeFirebase();

  useEffect(() => {
    if (!user || isUserLoading) return;

    const userRef = doc(firestore, 'users', user.uid);

    const initializeUser = async () => {
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        // User doesn't exist, let's create them
        const newUser = {
          id: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: 'student',
          points: 0, // Initial points
        };

        const userProfile = {
          id: user.uid,
          houseId: null, // No house assigned initially
          jurusan: 'Teknik Komputer & Jaringan', // Default
          kelas: 'XI TKJ 1', // Default
          points: 0,
          unlockedSkills: [],
        };
        
        // Non-blocking writes
        setDocumentNonBlocking(userRef, newUser, { merge: false });
        
        const profileRef = doc(firestore, `users/${user.uid}/profile`, user.uid);
        setDocumentNonBlocking(profileRef, userProfile, { merge: false });
      }
    };

    initializeUser().catch(console.error);

  }, [user, isUserLoading, firestore]);

  return null;
}


export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      <NewUserInitializer />
      {children}
    </FirebaseProvider>
  );
}
