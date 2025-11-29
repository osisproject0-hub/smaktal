'use client';

import { useState } from 'react';
import { useActionState, useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Bot, Loader2, BookOpen, Video, FileText } from 'lucide-react';
import { getLearningPlan } from './actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
      Dapatkan Jalur Belajar
    </Button>
  );
}

export default function AITutorPage() {
  const [state, formAction] = useActionState(getLearningPlan, null);
  const [topic, setTopic] = useState('');
  const firestore = useFirestore();

  const topicsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'learningTopics'), orderBy('order')) : null,
    [firestore]
  );
  const { data: learningTopics, isLoading: isLoadingTopics } = useCollection(topicsQuery);

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">AI Tutor Cerdas</CardTitle>
            <CardDescription>
              Pilih topik untuk mendapatkan jalur belajar dan bantuan yang dipersonalisasi.
            </CardDescription>
          </CardHeader>
          <form action={formAction}>
             <input type="hidden" name="topic" value={topic} />
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    AI akan menganalisis pemahaman awal Anda (disimulasikan) dan memberikan rekomendasi yang paling sesuai.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="topic">Pilih Topik Pembelajaran</Label>
                  {isLoadingTopics ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select name="topic" required onValueChange={setTopic}>
                      <SelectTrigger id="topic" aria-label="Pilih Topik">
                        <SelectValue placeholder="Pilih topik..." />
                      </SelectTrigger>
                      <SelectContent>
                        {learningTopics?.map((topic) => (
                          <SelectItem key={topic.id} value={topic.id}>
                            {topic.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>Rencana Belajar Anda</CardTitle>
            <CardDescription>Berikut adalah rekomendasi dan bantuan dari AI Tutor.</CardDescription>
          </CardHeader>
          <CardContent>
            {!state && (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
                    <Bot className="h-12 w-12 mb-4"/>
                    <p>Hasil akan ditampilkan di sini.</p>
                </div>
            )}
            {state?.error && (
                <Alert variant="destructive">
                    <AlertTitle>Terjadi Kesalahan</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                </Alert>
            )}
            {state?.recommendations && (
                <div className="space-y-6">
                    <div>
                        <h3 className="font-headline text-lg mb-2 flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary"/> Rekomendasi Materi</h3>
                        <ul className="space-y-2 list-inside">
                            {state.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted">
                                    {rec.toLowerCase().includes('video') ? <Video className="h-4 w-4 mt-1 text-red-600"/> : <FileText className="h-4 w-4 mt-1 text-blue-600"/>}
                                    <a href="#" className="text-sm text-primary hover:underline" onClick={(e) => e.preventDefault()}>{rec}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                         <h3 className="font-headline text-lg mb-2 flex items-center gap-2"><Bot className="h-5 w-5 text-primary"/> Bantuan Tambahan</h3>
                         <Alert>
                            <AlertDescription>{state.assistance}</AlertDescription>
                         </Alert>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
