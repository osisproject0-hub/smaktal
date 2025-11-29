'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import TeacherDashboard from '@/components/dashboard/TeacherDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import { where } from 'firebase/firestore';
import { collection, doc, query, orderBy, limit } from 'firebase/firestore';
import { Crown } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { cn } from '@/lib/utils';

function DashboardCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton shimmer className="h-4 w-1/2" />
        <Skeleton shimmer className="h-8 w-1/3" />
      </CardHeader>
      <CardContent>
        <Skeleton shimmer className="h-3 w-3/4" />
      </CardContent>
    </Card>
  );
}

function TableSkeleton({ rows = 4 }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead><Skeleton className="h-5 w-12" /></TableHead>
          <TableHead><Skeleton className="h-5 w-24" /></TableHead>
          <TableHead className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
            <TableCell><Skeleton className="h-6 w-32" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-6 w-20 ml-auto" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


export default function DashboardOverviewPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  // Data fetching
  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}/profile`, user.uid) : null, [user, firestore]);
  const { data: userProfile, isLoading: isUserProfileLoading } = useDoc(userProfileRef);

  // fetch user document (contains role)
  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
  const { data: currentUserData, isLoading: isCurrentUserLoading } = useDoc(userDocRef);

  const housesQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'houses'), orderBy('totalPoints', 'desc')) : null, [firestore]);
  const { data: sortedHouses, isLoading: areHousesLoading } = useCollection(housesQuery);
  
  const leaderboardQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'users'), orderBy('points', 'desc'), limit(5)) : null, [firestore]);
  const { data: leaderboard, isLoading: isLeaderboardLoading } = useCollection(leaderboardQuery);
  
  const skillTiersQuery = useMemoFirebase(() => firestore ? collection(firestore, 'skillTrees/tkj/tiers') : null, [firestore]);
  const { data: skillTiers, isLoading: areTiersLoading } = useCollection(skillTiersQuery);

  const houses = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'houses') : null, [firestore])).data;

  // Derived state and calculations
  const { majorProgress, certificatesEarned } = React.useMemo(() => {
    if (!skillTiers || !userProfile) {
      return { majorProgress: 0, certificatesEarned: 0 };
    }

    const unlockedSkills = new Set(userProfile.unlockedSkills || []);
    let totalSkills = 0;
    let certificates = 0;

    skillTiers.forEach((tier: any) => {
      const skillsInTier: any[] = tier.skills || [];
      totalSkills += skillsInTier.length;
      
      const allSkillsInTierUnlocked = skillsInTier.every(skill => unlockedSkills.has(skill.id));
      if (allSkillsInTierUnlocked && skillsInTier.length > 0) {
        certificates++;
      }
    });

    const progress = totalSkills > 0 ? (unlockedSkills.size / totalSkills) * 100 : 0;
    
    return {
      majorProgress: Math.round(progress),
      certificatesEarned: certificates
    };
  }, [skillTiers, userProfile]);

  const isLoading = isUserProfileLoading || areHousesLoading || isLeaderboardLoading || areTiersLoading || isCurrentUserLoading;
  
  const userHouse = sortedHouses?.find((h) => h.id === userProfile?.houseId);
  const userRank = leaderboard && user ? leaderboard.findIndex((s) => s.id === user.uid) + 1 : undefined;

  // queries for teacher view
  const teacherClassesQuery = useMemoFirebase(
    () => firestore && user && currentUserData?.role === 'teacher' ? query(collection(firestore, 'courses'), where('teacherId', '==', user.uid)) : null,
    [firestore, user, currentUserData]
  );
  const { data: teacherClasses, isLoading: isTeacherClassesLoading } = useCollection(teacherClassesQuery);

  // Render role-specific dashboard
  if (currentUserData?.role === 'teacher') {
    return <TeacherDashboard isLoading={isLoading || isTeacherClassesLoading} myClasses={teacherClasses ?? undefined} />;
  }

  if (currentUserData?.role === 'admin') {
    return <AdminDashboard isLoading={isLoading} />;
  }

  return (
    <StudentDashboard
      isLoading={isLoading}
      userProfile={userProfile}
      majorProgress={majorProgress}
      certificatesEarned={certificatesEarned}
      leaderboard={leaderboard ?? undefined}
      houses={houses ?? undefined}
      sortedHouses={sortedHouses ?? undefined}
      userRank={userRank}
    />
  );
}
