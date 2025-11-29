import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { skillTree } from '@/lib/mock-data';
import { CheckCircle2, Lock, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SkillTreePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl">Pohon Keahlian</h1>
        <p className="text-muted-foreground">Jalur pembelajaran Anda di jurusan {skillTree.name}.</p>
      </div>
      <div className="relative flex flex-col items-center gap-8 pl-4">
        {/* Central connecting line */}
        <div className="absolute left-10 top-0 h-full w-0.5 bg-border -z-10" />

        {skillTree.tiers.map((tier, tierIndex) => (
          <div key={tier.name} className="w-full">
            <div className="relative mb-4 flex items-center">
              <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <GitBranch className="h-6 w-6" />
              </div>
              <h2 className="ml-4 font-headline text-2xl">{tier.name}</h2>
            </div>
            <div className="grid gap-4 pl-16 md:grid-cols-2 lg:grid-cols-3">
              {tier.skills.map((skill) => (
                <Card
                  key={skill.id}
                  className={cn(
                    'transition-all hover:shadow-md hover:border-primary/50',
                    skill.unlocked ? 'bg-card' : 'bg-muted/50'
                  )}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{skill.name}</CardTitle>
                      {skill.unlocked ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <Lock className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <CardDescription>{skill.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
