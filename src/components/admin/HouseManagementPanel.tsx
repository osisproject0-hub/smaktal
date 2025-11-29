'use client';

import React from 'react';
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const houseSchema = z.object({
  name: z.string().min(3, "Nama rumah minimal 3 karakter."),
  totalPoints: z.coerce.number().min(0, "Poin tidak boleh negatif."),
  emblemUrl: z.string().url("URL Emblem tidak valid.").optional().or(z.literal('')),
});

type HouseFormValues = z.infer<typeof houseSchema>;

interface House extends HouseFormValues {
    id: string;
}

export default function HouseManagementPanel() {
    const firestore = useFirestore();
    const housesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'houses') : null, [firestore]);
    const { data: houses, isLoading } = useCollection<House>(housesQuery);
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [editingHouse, setEditingHouse] = React.useState<House | null>(null);

    const form = useForm<HouseFormValues>({
        resolver: zodResolver(houseSchema),
        defaultValues: { name: '', totalPoints: 0, emblemUrl: '' },
    });

    React.useEffect(() => {
        if (editingHouse) {
            form.reset(editingHouse);
        } else {
            form.reset({ name: '', totalPoints: 0, emblemUrl: '' });
        }
    }, [editingHouse, form, dialogOpen]);


    const onSubmit: SubmitHandler<HouseFormValues> = (data) => {
        if (!firestore) return;

        try {
            if (editingHouse) {
                // Update
                const houseRef = doc(firestore, 'houses', editingHouse.id);
                updateDocumentNonBlocking(houseRef, data);
                toast({ title: "Rumah Diperbarui", description: `Rumah "${data.name}" berhasil diperbarui.` });
            } else {
                // Create
                const housesRef = collection(firestore, 'houses');
                addDocumentNonBlocking(housesRef, data);
                toast({ title: "Rumah Ditambahkan", description: `Rumah "${data.name}" berhasil ditambahkan.` });
            }
            form.reset();
            setDialogOpen(false);
            setEditingHouse(null);
        } catch (error) {
           // Non-blocking update handles its own errors
        }
    };
    
    const handleDelete = (house: House) => {
        if (!firestore) return;
        const houseRef = doc(firestore, 'houses', house.id);
        deleteDocumentNonBlocking(houseRef);
        toast({ title: "Rumah Dihapus", description: `Rumah "${house.name}" telah dihapus.`, variant: 'destructive' });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manajemen Rumah</CardTitle>
                    <CardDescription>Tambah, edit, atau hapus rumah poin di sistem.</CardDescription>
                </div>
                 <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                         <Button onClick={() => setEditingHouse(null)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Rumah
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingHouse ? 'Edit Rumah' : 'Tambah Rumah Baru'}</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField control={form.control} name="name" render={({ field }) => (
                                    <FormItem><FormLabel>Nama Rumah</FormLabel><FormControl><Input placeholder="Contoh: Garuda" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="totalPoints" render={({ field }) => (
                                    <FormItem><FormLabel>Total Poin</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name="emblemUrl" render={({ field }) => (
                                    <FormItem><FormLabel>URL Emblem</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
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
                            <TableHead>Nama Rumah</TableHead>
                            <TableHead>Total Poin</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                           <TableRow><TableCell colSpan={3} className="text-center">Memuat data...</TableCell></TableRow>
                        ) : (
                            houses?.map(house => (
                                <TableRow key={house.id}>
                                    <TableCell className="font-medium">{house.name}</TableCell>
                                    <TableCell>{house.totalPoints.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                         <Button variant="ghost" size="icon" onClick={() => { setEditingHouse(house); setDialogOpen(true); }}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Anda yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini tidak dapat diurungkan. Ini akan menghapus rumah secara permanen.</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(house)}>Hapus</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                         {!isLoading && houses?.length === 0 && (
                            <TableRow><TableCell colSpan={3} className="text-center">Belum ada rumah yang ditambahkan.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
