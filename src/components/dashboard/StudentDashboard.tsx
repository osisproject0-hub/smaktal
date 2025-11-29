"use client";

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  isLoading?: boolean;
  userProfile?: any;
  majorProgress?: number;
  certificatesEarned?: number;
  leaderboard?: any[];
  houses?: any[];
  sortedHouses?: any[];
  userRank?: number | undefined;
};

export default function StudentDashboard({
  isLoading,
  userProfile,
  majorProgress,
  certificatesEarned,
  leaderboard,
  houses,
  sortedHouses,
  userRank,
}: Props) {
  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <Skeleton shimmer className="h-6 w-1/2" />
            <Skeleton shimmer className="h-8 w-2/3" />
          </CardHeader>
          <CardContent>
            <Skeleton shimmer className="h-3 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2 lg:grid-cols-2 xl:col-span-3 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Poin Saya</CardDescription>
            <CardTitle className="font-headline text-4xl">{userProfile?.points || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {typeof userRank === 'number' && userRank > 0
                ? `Peringkat #${userRank} di antara siswa teratas`
                : 'Peringkat tidak tersedia'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rumah Saya</CardDescription>
            <CardTitle className="font-headline text-3xl flex items-center gap-2">
              {sortedHouses?.find((h) => h.id === userProfile?.houseId)?.name || 'Belum ada'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">Total poin rumah: {sortedHouses?.find((h) => h.id === userProfile?.houseId)?.totalPoints?.toLocaleString('id-ID') || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Progress Jurusan</CardDescription>
            <CardTitle className="font-headline text-4xl">{majorProgress}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={majorProgress} aria-label={`${majorProgress}% progress`} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Sertifikat Diraih</CardDescription>
            <CardTitle className="font-headline text-4xl">{certificatesEarned}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">dari {sortedHouses?.length || 0} tingkatan</div>
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
            <div className="space-y-2">
              {sortedHouses?.slice(0, 5).map((h: any, idx: number) => (
                <div className="flex items-center justify-between" key={h.id}>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center font-semibold">{idx + 1}</div>
                    <div className="flex flex-col">
                      <span className="font-medium">{h.name}</span>
                      <span className="text-xs text-muted-foreground">{h.totalPoints?.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                  <Badge variant="secondary">{h.totalPoints?.toLocaleString('id-ID')}</Badge>
                </div>
              ))}
            </div>
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
            {leaderboard?.slice(0, 8).map((student: any, idx: number) => (
              <div key={student.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    {student.photoURL && <AvatarImage src={student.photoURL} alt={student.displayName} />}
                    <AvatarFallback>{student.displayName?.charAt(0) || 'S'}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{student.displayName}</span>
                    <span className="text-xs text-muted-foreground">{houses?.find((h) => h.id === student.houseId)?.name || '?'}</span>
                  </div>
                </div>
                <div className="font-semibold">{student.points}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
