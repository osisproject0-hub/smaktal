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
import { collection, doc, query, orderBy, limit } from 'firebase/firestore';
import { Crown } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

function DashboardCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-1/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-3 w-3/4" />
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

  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}/profile`, user.uid) : null, [user, firestore]);
  const { data: userProfile, isLoading: isUserProfileLoading } = useDoc(userProfileRef);

  const housesQuery = useMemoFirebase(() => collection(firestore, 'houses'), [firestore]);
  const { data: houses, isLoading: areHousesLoading } = useCollection(housesQuery);
  
  const leaderboardQuery = useMemoFirebase(() => query(collection(firestore, 'users'), orderBy('points', 'desc'), limit(5)), [firestore]);
  const { data: leaderboard, isLoading: isLeaderboardLoading } = useCollection(leaderboardQuery);

  const userHouse = houses?.find((h) => h.id === userProfile?.houseId);
  const sortedHouses = houses ? [...houses].sort((a, b) => b.points - a.points) : [];
  
  // Note: Rank is based on the limited leaderboard query, not all users.
  const userRank = leaderboard?.findIndex((s) => s.id === user?.uid) + 1;

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2 lg:grid-cols-2 xl:col-span-3 xl:grid-cols-4">
        {isUserProfileLoading ? <DashboardCardSkeleton /> : (
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Poin Saya</CardDescription>
              <CardTitle className="font-headline text-4xl">{userProfile?.points || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {userRank > 0 ? `Peringkat #${userRank} dari ${leaderboard?.length}` : 'Peringkat tidak tersedia'}
              </div>
            </CardContent>
          </Card>
        )}
        {(isUserProfileLoading || areHousesLoading) ? <DashboardCardSkeleton /> : (
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Rumah Saya</CardDescription>
              <CardTitle className="font-headline text-3xl flex items-center gap-2">
                {userHouse?.name || 'Belum ada'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Total poin rumah: {userHouse?.totalPoints?.toLocaleString('id-ID') || 0}
              </div>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Progress Jurusan</CardDescription>
            <CardTitle className="font-headline text-4xl">45%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={45} aria-label="45% progress" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Sertifikat Diraih</CardDescription>
            <CardTitle className="font-headline text-4xl">3</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">2 dalam progress</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Papan Peringkat Rumah</CardTitle>
            <CardDescription>Peringkat rumah berdasarkan total poin yang dikumpulkan.</CardDescription>
          </CardHeader>
          <CardContent>
            {areHousesLoading ? <TableSkeleton /> : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Peringkat</TableHead>
                    <TableHead>Rumah</TableHead>
                    <TableHead className="text-right">Poin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedHouses.map((house, index) => (
                    <TableRow key={house.id} className={house.id === userProfile?.houseId ? "bg-accent" : ""}>
                      <TableCell>
                        <div className="font-medium flex items-center justify-center h-8 w-8 rounded-full bg-muted">
                          {index === 0 ? <Crown className="h-5 w-5 text-yellow-500" /> : index + 1}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {house.emblemUrl && <Image src={house.emblemUrl} alt={house.name} width={40} height={40} className="rounded-full" />}
                          <span className="font-medium">{house.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{house.totalPoints.toLocaleString('id-ID')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-4 lg:col-span-1 xl:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Papan Peringkat Siswa</CardTitle>
             <CardDescription>Siswa dengan poin tertinggi di seluruh sekolah.</CardDescription>
          </CardHeader>
          <CardContent>
             {isLeaderboardLoading ? <TableSkeleton rows={5} /> : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Rank</TableHead>
                    <TableHead>Siswa</TableHead>
                    <TableHead>Rumah</TableHead>
                    <TableHead className="text-right">Poin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard?.map((student, index) => {
                    const studentHouse = houses?.find(h => h.id === student.houseId);
                    return (
                      <TableRow key={student.id} className={student.id === user?.uid ? "bg-accent" : ""}>
                        <TableCell className="font-medium text-center">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              {student.photoURL && <AvatarImage src={student.photoURL} alt={student.displayName} />}
                              <AvatarFallback>{student.displayName?.charAt(0) || 'S'}</AvatarFallback>
                            </Avatar>
                            {student.displayName}
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="secondary">{studentHouse?.name || '?'}</Badge></TableCell>
                        <TableCell className="text-right font-semibold">{student.points}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
