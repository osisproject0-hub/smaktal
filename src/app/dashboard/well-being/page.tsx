'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Smile, Meh, Frown, Laugh, Angry } from 'lucide-react';
import { wellbeingResources } from '@/lib/mock-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

const moodOptions = [
  { mood: 'Senang', icon: Laugh, color: 'text-green-500' },
  { mood: 'Baik', icon: Smile, color: 'text-blue-500' },
  { mood: 'Biasa', icon: Meh, color: 'text-yellow-500' },
  { mood: 'Sedih', icon: Frown, color: 'text-gray-500' },
  { mood: 'Marah', icon: Angry, color: 'text-red-500' },
];

export default function WellbeingPage() {
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleMoodSubmit = () => {
    if (selectedMood) {
      toast({
        title: 'Check-in Berhasil',
        description: `Terima kasih telah berbagi perasaan Anda hari ini. Mood Anda: ${selectedMood}.`,
      });
      setSelectedMood(null);
    }
  };
  
  const handleAppointmentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const reason = formData.get('reason');

    if (!reason) {
      toast({
        title: 'Gagal Membuat Janji',
        description: 'Mohon isi alasan pertemuan Anda.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Permintaan Janji Terkirim',
      description: 'Konselor akan segera menghubungi Anda untuk penjadwalan.',
    });
    (e.target as HTMLFormElement).reset();
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-3">
        <h1 className="font-headline text-3xl md:text-4xl">Pusat Kesejahteraan</h1>
        <p className="text-muted-foreground">Kesehatan mental Anda adalah prioritas kami.</p>
      </div>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Check-in Suasana Hati</CardTitle>
          <CardDescription>Bagaimana perasaan Anda hari ini? Data ini anonim.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {moodOptions.map(({ mood, icon: Icon, color }) => (
            <Button
              key={mood}
              variant="outline"
              className={cn(
                'h-20 w-20 flex-col gap-2 rounded-lg border-2 text-sm font-semibold',
                selectedMood === mood ? 'border-primary bg-accent' : ''
              )}
              onClick={() => setSelectedMood(mood)}
            >
              <Icon className={cn('h-8 w-8', color)} />
              {mood}
            </Button>
          ))}
        </CardContent>
        <CardFooter>
          <Button onClick={handleMoodSubmit} disabled={!selectedMood} className="ml-auto">
            Kirim
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Buat Janji dengan Konselor</CardTitle>
          <CardDescription>Jadwalkan sesi rahasia dengan konselor sekolah.</CardDescription>
        </CardHeader>
        <form onSubmit={handleAppointmentSubmit}>
            <CardContent>
                <div className="grid w-full items-center gap-2">
                    <Label htmlFor="reason">Alasan singkat (opsional)</Label>
                    <Textarea id="reason" name="reason" placeholder="Contoh: Stres karena tugas, masalah pribadi, dll." />
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" className="w-full">Minta Jadwal</Button>
            </CardFooter>
        </form>
      </Card>
      
      <div className="lg:col-span-3">
          <h2 className="font-headline text-2xl mt-4 mb-4">Sumber Daya</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {wellbeingResources.map(resource => {
                  const resourceImage = PlaceHolderImages.find(img => img.id === resource.imageId);
                  return (
                    <Card key={resource.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        {resourceImage && (
                            <Image 
                                src={resourceImage.imageUrl} 
                                alt={resource.title} 
                                width={400} 
                                height={225} 
                                className="w-full object-cover aspect-video"
                                data-ai-hint={resourceImage.imageHint}
                            />
                        )}
                        <CardHeader>
                            <CardTitle className="text-base">{resource.title}</CardTitle>
                            <CardDescription>{resource.type} dari {resource.source}</CardDescription>
                        </CardHeader>
                    </Card>
                  )
              })}
          </div>
      </div>
    </div>
  );
}
