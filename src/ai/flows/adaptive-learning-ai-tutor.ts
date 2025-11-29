'use server';
/**
 * @fileOverview An AI tutor that provides personalized learning recommendations and assistance based on diagnostic quiz results.
 *
 * - adaptiveLearningAITutor - A function that handles the personalized learning process.
 * - AdaptiveLearningAITutorInput - The input type for the adaptiveLearningAITutor function.
 * - AdaptiveLearningAITutorOutput - The return type for the adaptiveLearningAITutor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptiveLearningAITutorInputSchema = z.object({
  quizResults: z.record(z.string(), z.number()).describe('The results of the diagnostic quiz, with question IDs as keys and scores as values.'),
  learningTopic: z.string().describe('The topic the student is currently learning.'),
  studentId: z.string().describe('The ID of the student.'),
});
export type AdaptiveLearningAITutorInput = z.infer<typeof AdaptiveLearningAITutorInputSchema>;

const AdaptiveLearningAITutorOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('A list of learning resource recommendations (e.g., video URLs, article links).'),
  assistance: z.string().describe('AI-generated assistance, such as hints or simpler questions.'),
});
export type AdaptiveLearningAITutorOutput = z.infer<typeof AdaptiveLearningAITutorOutputSchema>;

export async function adaptiveLearningAITutor(input: AdaptiveLearningAITutorInput): Promise<AdaptiveLearningAITutorOutput> {
  return adaptiveLearningAITutorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptiveLearningAITutorPrompt',
  input: {schema: AdaptiveLearningAITutorInputSchema},
  output: {schema: AdaptiveLearningAITutorOutputSchema},
  prompt: `You are an AI tutor specializing in personalized learning.

  Based on the student's diagnostic quiz results and the current learning topic, provide personalized learning resource recommendations and assistance.

  Quiz Results:
  {{#each ( quizResults ) }}
    {{@key}}: {{this}}
  {{/each}}

  Learning Topic: {{{learningTopic}}}

  Recommendations:
  - List relevant video URLs, article links, and practice exercises.

  Assistance:
  - If the student is struggling, offer hints or simpler questions related to the topic.
`,
});

const adaptiveLearningAITutorFlow = ai.defineFlow(
  {
    name: 'adaptiveLearningAITutorFlow',
    inputSchema: AdaptiveLearningAITutorInputSchema,
    outputSchema: AdaptiveLearningAITutorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
