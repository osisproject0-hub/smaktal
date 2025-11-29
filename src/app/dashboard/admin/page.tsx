'use client';

import { ShieldOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

import UserManagementPanel from '@/components/admin/UserManagementPanel';
import HouseManagementPanel from '@/components/admin/HouseManagementPanel';
import AnnouncementManagementPanel from '@/components/admin/AnnouncementManagementPanel';
import ResourceManagementPanel from '@/components/admin/ResourceManagementPanel';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
  const { data: currentUserData, isLoading: isCurrentUserLoading } = useDoc(userDocRef);

  const isLoading = isUserLoading || isCurrentUserLoading;

  if (isLoading) {
     return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentUserData?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-96 rounded-lg border border-dashed text-center">
          <ShieldOff className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-headline">Akses Ditolak</h2>
          <p className="text-muted-foreground mt-2">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
        <div>
            <h1 className="font-headline text-3xl md:text-4xl">Panel Admin</h1>
            <p className="text-muted-foreground">Kelola semua aspek platform dari satu tempat.</p>
        </div>
        <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="users">Pengguna</TabsTrigger>
                <TabsTrigger value="houses">Rumah</TabsTrigger>
                <TabsTrigger value="announcements">Pengumuman</TabsTrigger>
                <TabsTrigger value="resources">Sumber Daya</TabsTrigger>
            </TabsList>
            <TabsContent value="users">
                <UserManagementPanel />
            </TabsContent>
            <TabsContent value="houses">
                <HouseManagementPanel />
            </TabsContent>
            <TabsContent value="announcements">
                <AnnouncementManagementPanel />
            </TabsContent>
            <TabsContent value="resources">
                <ResourceManagementPanel />
            </TabsContent>
        </Tabs>
    </div>
  );
}
