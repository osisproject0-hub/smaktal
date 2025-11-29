"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import MotionContainer from '@/components/ui/motion';
import { motion } from 'framer-motion';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { BookOpen, MessageSquare, CheckSquare } from 'lucide-react';

type Props = {
  isLoading?: boolean;
  myClasses?: any[];
};

export default function TeacherDashboard({ isLoading, myClasses = [] }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton shimmer className="h-6 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton shimmer className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.06 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.995 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 220, damping: 28 } },
  };

  // get assignments for this teacher and compute counts per course
  const { user } = useUser();
  const firestore = useFirestore();

  const assignmentsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'assignments'), where('teacherId', '==', user.uid));
  }, [firestore, user]);

  const { data: assignments, isLoading: isAssignmentsLoading } = useCollection(assignmentsQuery);

  const assignmentCounts = React.useMemo(() => {
    if (!assignments) return {} as Record<string, number>;
    return assignments.reduce((acc: Record<string, number>, a: any) => {
      const cid = a?.courseId || 'unknown';
      acc[cid] = (acc[cid] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [assignments]);

  return (
    <MotionContainer className="w-full">
      <motion.div initial="hidden" animate="show" variants={containerVariants} className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-headline text-2xl">My Classes</CardTitle>
                <CardDescription>Classes you manage and teach</CardDescription>
              </div>
              <BookOpen className="h-8 w-8 text-primary/90" />
            </div>
          </CardHeader>
          <CardContent>
            {myClasses.length === 0 ? (
              <div className="text-sm text-muted-foreground">Anda belum memiliki kelas. Buat kelas baru untuk memulai.</div>
            ) : (
              <motion.ul className="space-y-2" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
                {myClasses.map((c: any, idx: number) => (
                  <motion.li key={c.id || idx} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold">{c.title}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div>{c.studentCount ?? 0} siswa</div>
                        <div className="px-2 py-0.5 rounded-md bg-muted/40">{assignmentCounts[c.id] ?? 0} tugas</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Open</Button>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-headline text-2xl">Pending Reviews</CardTitle>
                <CardDescription>Quizzes and assignments waiting for grading</CardDescription>
              </div>
              <CheckSquare className="h-8 w-8 text-secondary/90" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Tidak ada yang menunggu saat ini — hebat!</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-headline text-2xl">Messages</CardTitle>
                <CardDescription>Terima pesan langsung dari siswa dan admin</CardDescription>
              </div>
              <MessageSquare className="h-8 w-8 text-accent/90" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="rounded-full h-8 w-8 bg-muted flex items-center justify-center">B</div>
              <div>
                <div className="font-medium">Budi Santoso</div>
                <div className="text-xs text-muted-foreground">Pertanyaan tentang tugas minggu ini</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      </motion.div>
    </MotionContainer>
  );
}
