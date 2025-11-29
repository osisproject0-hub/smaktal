'use client';

import React from 'react';
import { useCollection, useFirestore, useMemoFirebase, useUser, addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { format } from 'date-fns';

const announcementSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter."),
  content: z.string().min(10, "Konten minimal 10 karakter."),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

interface Announcement extends AnnouncementFormValues {
    id: string;
    createdAt: any;
    authorName: string;
}

export default function AnnouncementManagementPanel() {
    const { user } = useUser();
    const firestore = useFirestore();
    const announcementsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'announcements') : null, [firestore]);
    const { data: announcements, isLoading } = useCollection<Announcement>(announcementsQuery);
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = React.useState<Announcement | null>(null);

    const form = useForm<AnnouncementFormValues>({
        resolver: zodResolver(announcementSchema),
        defaultValues: { title: '', content: '' },
    });

    React.useEffect(() => {
        if (editingAnnouncement) {
            form.reset(editingAnnouncement);
        } else {
            form.reset({ title: '', content: '' });
        }
    }, [editingAnnouncement, form, dialogOpen]);


    const onSubmit: SubmitHandler<AnnouncementFormValues> = async (data) => {
        if (!firestore || !user) return;

        try {
            if (editingAnnouncement) {
                const announcementRef = doc(firestore, 'announcements', editingAnnouncement.id);
                updateDocumentNonBlocking(announcementRef, data);
                toast({ title: "Pengumuman Diperbarui", description: `Pengumuman "${data.title}" berhasil diperbarui.` });
            } else {
                const announcementsRef = collection(firestore, 'announcements');
                const newAnnouncement = {
                    ...data,
                    authorName: user.displayName || 'Admin',
                    createdAt: serverTimestamp(),
                };
                addDocumentNonBlocking(announcementsRef, newAnnouncement);
                toast({ title: "Pengumuman Diterbitkan", description: `Pengumuman "${data.title}" berhasil diterbitkan.` });
            }
            form.reset();
            setDialogOpen(false);
            setEditingAnnouncement(null);
        } catch (error) {
            // Non-blocking update handles its own errors
        }
    };
    
    const handleDelete = (announcement: Announcement) => {
        if (!firestore) return;
        const announcementRef = doc(firestore, 'announcements', announcement.id);
        deleteDocumentNonBlocking(announcementRef);
        toast({ title: "Pengumuman Dihapus", description: `Pengumuman "${announcement.title}" telah dihapus.`, variant: 'destructive' });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manajemen Pengumuman</CardTitle>
                    <CardDescription>Buat, edit, atau hapus pengumuman untuk seluruh sekolah.</CardDescription>
                </div>
                 <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                         <Button onClick={() => setEditingAnnouncement(null)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Buat Pengumuman
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingAnnouncement ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField control={form.control} name="title" render={({ field }) => (
                                    <FormItem><FormLabel>Judul</FormLabel><FormControl><Input placeholder="Judul pengumuman..." {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="content" render={({ field }) => (
                                    <FormItem><FormLabel>Isi Pengumuman</FormLabel><FormControl><Textarea placeholder="Tulis isi pengumuman di sini..." {...field} rows={5} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <DialogFooter>
                                    <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
                                    <Button type="submit">Simpan</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Judul</TableHead>
                            <TableHead>Tanggal Dibuat</TableHead>
                            <TableHead>Penulis</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                           <TableRow><TableCell colSpan={4} className="text-center">Memuat data...</TableCell></TableRow>
                        ) : (
                            announcements?.map(announcement => (
                                <TableRow key={announcement.id}>
                                    <TableCell className="font-medium">{announcement.title}</TableCell>
                                    <TableCell>{announcement.createdAt ? format(announcement.createdAt.toDate(), 'dd MMM yyyy') : 'N/A'}</TableCell>
                                    <TableCell>{announcement.authorName}</TableCell>
                                    <TableCell className="text-right">
                                         <Button variant="ghost" size="icon" onClick={() => { setEditingAnnouncement(announcement); setDialogOpen(true); }}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Anda yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini akan menghapus pengumuman secara permanen.</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(announcement)}>Hapus</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                         {!isLoading && announcements?.length === 0 && (
                            <TableRow><TableCell colSpan={4} className="text-center">Belum ada pengumuman.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
