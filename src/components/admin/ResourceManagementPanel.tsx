'use client';

import React from 'react';
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

const resourceSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter."),
  type: z.enum(["Video", "Artikel", "Podcast"], { required_error: "Tipe harus dipilih."}),
  source: z.string().min(3, "Sumber minimal 3 karakter."),
  imageId: z.string().min(1, "Image ID harus diisi (contoh: resource_video)."),
});

type ResourceFormValues = z.infer<typeof resourceSchema>;

interface Resource extends ResourceFormValues {
    id: string;
}

export default function ResourceManagementPanel() {
    const firestore = useFirestore();
    const resourcesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'resources') : null, [firestore]);
    const { data: resources, isLoading } = useCollection<Resource>(resourcesQuery);
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [editingResource, setEditingResource] = React.useState<Resource | null>(null);

    const form = useForm<ResourceFormValues>({
        resolver: zodResolver(resourceSchema),
        defaultValues: { title: '', type: 'Artikel', source: '', imageId: '' },
    });

    React.useEffect(() => {
        if (editingResource) {
            form.reset(editingResource);
        } else {
            form.reset({ title: '', type: 'Artikel', source: '', imageId: '' });
        }
    }, [editingResource, form, dialogOpen]);


    const onSubmit: SubmitHandler<ResourceFormValues> = (data) => {
        if (!firestore) return;

        if (editingResource) {
            const resourceRef = doc(firestore, 'resources', editingResource.id);
            updateDocumentNonBlocking(resourceRef, data);
            toast({ title: "Sumber Daya Diperbarui", description: `Sumber daya "${data.title}" berhasil diperbarui.` });
        } else {
            const resourcesRef = collection(firestore, 'resources');
            addDocumentNonBlocking(resourcesRef, data);
            toast({ title: "Sumber Daya Ditambahkan", description: `Sumber daya "${data.title}" berhasil ditambahkan.` });
        }
        form.reset();
        setDialogOpen(false);
        setEditingResource(null);
    };
    
    const handleDelete = (resource: Resource) => {
        if (!firestore) return;
        const resourceRef = doc(firestore, 'resources', resource.id);
        deleteDocumentNonBlocking(resourceRef);
        toast({ title: "Sumber Daya Dihapus", description: `Sumber daya "${resource.title}" telah dihapus.`, variant: 'destructive' });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manajemen Sumber Daya</CardTitle>
                    <CardDescription>Kelola sumber daya kesejahteraan yang tersedia untuk siswa.</CardDescription>
                </div>
                 <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                         <Button onClick={() => setEditingResource(null)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Sumber Daya
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingResource ? 'Edit Sumber Daya' : 'Tambah Sumber Daya Baru'}</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField control={form.control} name="title" render={({ field }) => (
                                    <FormItem><FormLabel>Judul</FormLabel><FormControl><Input placeholder="Judul video/artikel..." {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="type" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipe</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Pilih tipe..." /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="Video">Video</SelectItem>
                                                <SelectItem value="Artikel">Artikel</SelectItem>
                                                <SelectItem value="Podcast">Podcast</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="source" render={({ field }) => (
                                    <FormItem><FormLabel>Sumber</FormLabel><FormControl><Input placeholder="Contoh: YouTube, Blog, Spotify" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name="imageId" render={({ field }) => (
                                    <FormItem><FormLabel>Image ID</FormLabel><FormControl><Input placeholder="Contoh: resource_video" {...field} /></FormControl><FormMessage /></FormItem>
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
                            <TableHead>Tipe</TableHead>
                            <TableHead>Sumber</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                           <TableRow><TableCell colSpan={4} className="text-center">Memuat data...</TableCell></TableRow>
                        ) : (
                            resources?.map(resource => (
                                <TableRow key={resource.id}>
                                    <TableCell className="font-medium">{resource.title}</TableCell>
                                    <TableCell>{resource.type}</TableCell>
                                    <TableCell>{resource.source}</TableCell>
                                    <TableCell className="text-right">
                                         <Button variant="ghost" size="icon" onClick={() => { setEditingResource(resource); setDialogOpen(true); }}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Anda yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini akan menghapus sumber daya secara permanen.</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(resource)}>Hapus</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                         {!isLoading && resources?.length === 0 && (
                            <TableRow><TableCell colSpan={4} className="text-center">Belum ada sumber daya.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
