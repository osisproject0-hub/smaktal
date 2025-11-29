import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
import { currentUser, houses, leaderboard } from '@/lib/mock-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Crown, Trophy } from 'lucide-react';
import Image from 'next/image';

export default function DashboardOverviewPage() {
  const userHouse = houses.find((h) => h.name === currentUser.house);
  const sortedHouses = [...houses].sort((a, b) => b.points - a.points);
  const userRank = leaderboard.findIndex((s) => s.id === currentUser.id) + 1;

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2 lg:grid-cols-2 xl:col-span-3 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Poin Saya</CardDescription>
            <CardTitle className="font-headline text-4xl">{currentUser.points}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">Peringkat #{userRank} dari {leaderboard.length} siswa</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rumah Saya</CardDescription>
            <CardTitle className="font-headline text-3xl flex items-center gap-2">
              {currentUser.house}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Total poin rumah: {userHouse?.points.toLocaleString('id-ID')}
            </div>
          </CardContent>
        </Card>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Peringkat</TableHead>
                  <TableHead>Rumah</TableHead>
                  <TableHead className="text-right">Poin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedHouses.map((house, index) => {
                   const houseEmblem = PlaceHolderImages.find((img) => img.id === house.emblemId);
                  return (
                  <TableRow key={house.id} className={house.name === currentUser.house ? "bg-accent" : ""}>
                    <TableCell>
                      <div className="font-medium flex items-center justify-center h-8 w-8 rounded-full bg-muted">
                        {index === 0 ? <Crown className="h-5 w-5 text-yellow-500" /> : index + 1}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                         {houseEmblem && <Image src={houseEmblem.imageUrl} alt={house.name} width={40} height={40} className="rounded-full" data-ai-hint={houseEmblem.imageHint} />}
                        <span className="font-medium">{house.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{house.points.toLocaleString('id-ID')}</TableCell>
                  </TableRow>
                )})}
              </TableBody>
            </Table>
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
                {leaderboard.map((student, index) => {
                  const studentAvatar = PlaceHolderImages.find((img) => img.id === student.avatarId);
                  return (
                    <TableRow key={student.id} className={student.id === currentUser.id ? "bg-accent" : ""}>
                      <TableCell className="font-medium text-center">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                             {studentAvatar && <AvatarImage src={studentAvatar.imageUrl} alt={student.name} data-ai-hint={studentAvatar.imageHint}/>}
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {student.name}
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="secondary">{student.house}</Badge></TableCell>
                      <TableCell className="text-right font-semibold">{student.points}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
