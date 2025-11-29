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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Shield, ShieldOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function UserTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-20" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-10 w-28 ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
  const { data: currentUserData, isLoading: isCurrentUserLoading } = useDoc(userDocRef);

  const usersQuery = useMemoFirebase(() => firestore ? collection(firestore, 'users') : null, [firestore]);
  const { data: allUsers, isLoading: areAllUsersLoading } = useCollection(usersQuery);

  const isLoading = isUserLoading || isCurrentUserLoading || areAllUsersLoading;

  const handleRoleChange = (userId: string, newRole: string) => {
    if (!firestore) return;
    const targetUserRef = doc(firestore, 'users', userId);
    updateDocumentNonBlocking(targetUserRef, { role: newRole })
      .then(() => {
        toast({
          title: 'Peran Diperbarui',
          description: `Peran untuk pengguna telah berhasil diubah menjadi ${newRole}.`,
        });
      })
      .catch((error: any) => {
        // Error already handled globally
      });
  };

  if (isLoading) {
     return (
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Pengguna</CardTitle>
          <CardDescription>Mengubah peran dan mengelola pengguna di seluruh sistem.</CardDescription>
        </CardHeader>
        <CardContent>
            <UserTableSkeleton />
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
    <Card>
      <CardHeader>
        <CardTitle>Manajemen Pengguna</CardTitle>
        <CardDescription>Mengubah peran dan mengelola pengguna di seluruh sistem.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pengguna</TableHead>
              <TableHead>Peran</TableHead>
              <TableHead className="text-right w-[150px]">Ubah Peran</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allUsers?.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={u.photoURL} alt={u.displayName} />
                      <AvatarFallback>{u.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{u.displayName}</div>
                      <div className="text-sm text-muted-foreground">{u.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Select 
                    defaultValue={u.role} 
                    onValueChange={(newRole) => handleRoleChange(u.id, newRole)}
                    disabled={u.id === user?.uid} // Admin can't change their own role
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
