'use server';

import { adaptiveLearningAITutor } from '@/ai/flows/adaptive-learning-ai-tutor';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, getDocs, collection } from 'firebase/firestore';
import { getSdks } from '@/firebase'; // Using admin-like SDK access on server
import { headers } from 'next/headers';
import { getAuth } from 'firebase/auth';

async function getUserIdFromServer() {
    // This is a placeholder for getting the user ID on the server.
    // In a real app, you'd use a session or token.
    // For this example, we'll assume a fixed user for the server action.
    // WARNING: This is NOT secure for a real application.
     const auth = getAuth();
     // In a server component, there is no current user. 
     // You would need to implement a session management system.
     // For now, we hardcode it for demonstration.
    return 'user1_budi_santoso';
}


export async function getLearningPlan(prevState: any, formData: FormData) {
  const topicId = formData.get('topic') as string;
  const { firestore } = getSdks(undefined as any); // In server actions, we need to initialize differently.
  
  if (!topicId) {
    return { error: 'Topik tidak valid. Silakan pilih dari daftar.' };
  }
  
  const userId = await getUserIdFromServer();
  
  const topicRef = doc(firestore, 'learningTopics', topicId);
  const quizResultRef = doc(firestore, `quizResults/${userId}_${topicId}`);

  try {
    const [topicSnap, quizResultSnap] = await Promise.all([
        getDoc(topicRef),
        getDoc(quizResultRef)
    ]);

    if (!topicSnap.exists()) {
        return { error: 'Topik pembelajaran tidak ditemukan.' };
    }
    const topicLabel = topicSnap.data()?.label;

    let quizResults;
    if (quizResultSnap.exists()) {
        quizResults = quizResultSnap.data()?.results;
    } else {
        // Simulate a new student's first diagnostic quiz and save it.
        const mockQuizResults = {
            'q1_dasar': 100,
            'q2_konfigurasi': 40,
            'q3_keamanan': 20,
        };
        
        await setDoc(quizResultRef, {
            userId: userId,
            topicId: topicId,
            results: mockQuizResults,
            createdAt: serverTimestamp()
        });
        quizResults = mockQuizResults;
    }

    const result = await adaptiveLearningAITutor({
      quizResults: quizResults,
      learningTopic: topicLabel,
      studentId: userId,
    });
    return result;

  } catch (e: any) {
    console.error("Error in getLearningPlan:", e);
    return { error: e.message || 'Gagal menghubungi AI Tutor. Silakan coba lagi nanti.' };
  }
}

    