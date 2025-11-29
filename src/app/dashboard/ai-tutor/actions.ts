'use server';

import { adaptiveLearningAITutor } from '@/ai/flows/adaptive-learning-ai-tutor';
import { learningTopics } from '@/lib/mock-data';

export async function getLearningPlan(prevState: any, formData: FormData) {
  const topicValue = formData.get('topic') as string;
  const topicLabel = learningTopics.find(t => t.value === topicValue)?.label;

  if (!topicLabel) {
    return { error: 'Topik tidak valid. Silakan pilih dari daftar.' };
  }

  // In a real application, quizResults would come from a database based on the student's performance.
  // Here, we simulate a student struggling with some concepts.
  const mockQuizResults = {
    'q1_dasar': 100,
    'q2_konfigurasi': 40,
    'q3_keamanan': 20,
  };

  try {
    const result = await adaptiveLearningAITutor({
      quizResults: mockQuizResults,
      learningTopic: topicLabel,
      studentId: 'user1_budi_santoso', // This would be dynamic in a real app
    });
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'Gagal menghubungi AI Tutor. Silakan coba lagi nanti.' };
  }
}
