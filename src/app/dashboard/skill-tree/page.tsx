'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { cn } from '@/lib/utils';
import { collection, query, orderBy } from 'firebase/firestore';
import { CheckCircle2, Lock, GitBranch, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


function SkillTierSkeleton() {
  return (
    <div className="w-full">
      <div className="relative mb-4 flex items-center">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="ml-4 h-8 w-48" />
      </div>
      <div className="grid gap-4 pl-16 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-28 w-full rounded-lg" />
        <Skeleton className="h-28 w-full rounded-lg" />
        <Skeleton className="h-28 w-full rounded-lg" />
      </div>
    </div>
  );
}


export default function SkillTreePage() {
  const firestore = useFirestore();

  // In a real app, this would be dynamic based on the user's major
  const skillTreeName = 'Teknik Komputer & Jaringan'; 

  const tiersQuery = useMemoFirebase(
    () => query(collection(firestore, 'skillTrees/tkj/tiers'), orderBy('order')),
    [firestore]
  );
  const { data: tiers, isLoading: isLoadingTiers } = useCollection(tiersQuery);

  // In a real app, user's unlocked skills would be fetched from their profile
  const unlockedSkills = new Set(['sk01', 'sk02', 'sk03', 'sk05']);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl">Pohon Keahlian</h1>
        {isLoadingTiers ? (
          <Skeleton className="h-5 w-64 mt-2" />
        ) : (
          <p className="text-muted-foreground">Jalur pembelajaran Anda di jurusan {skillTreeName}.</p>
        )}
      </div>
      {isLoadingTiers ? (
         <div className="space-y-8">
            <SkillTierSkeleton />
            <SkillTierSkeleton />
         </div>
      ) : (
        <div className="relative flex flex-col items-center gap-8 pl-4">
          {/* Central connecting line */}
          <div className="absolute left-10 top-0 h-full w-0.5 bg-border -z-10" />

          {tiers?.map((tier: any) => (
            <div key={tier.id} className="w-full">
              <div className="relative mb-4 flex items-center">
                <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <GitBranch className="h-6 w-6" />
                </div>
                <h2 className="ml-4 font-headline text-2xl">{tier.name}</h2>
              </div>
              <div className="grid gap-4 pl-16 md:grid-cols-2 lg:grid-cols-3">
                {tier.skills?.map((skill: any) => {
                  const isUnlocked = unlockedSkills.has(skill.id);
                  return (
                    <Card
                      key={skill.id}
                      className={cn(
                        'transition-all hover:shadow-md hover:border-primary/50',
                        isUnlocked ? 'bg-card animate-fade-in' : 'bg-muted/50 opacity-80'
                      )}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{skill.name}</CardTitle>
                          {isUnlocked ? (
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                          ) : (
                            <Lock className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <CardDescription>{skill.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
