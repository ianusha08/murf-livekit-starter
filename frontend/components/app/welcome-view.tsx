import { BookOpen, GraduationCap, Mic, Sparkles, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function LearningHeroIcon() {
  return (
    <div className="relative mb-6 flex items-center justify-center">
      <div className="flex size-20 items-center justify-center rounded-full border border-[#5d6162]/30 bg-[#5d6162]/15 text-[#63645c] shadow-md">
        <GraduationCap className="size-10" />
      </div>
      <div className="absolute -right-1 -bottom-1 rounded-full border border-[#73746c]/40 bg-[#5d6162] p-1.5 text-white shadow-md">
        <BookOpen className="size-4" />
      </div>
    </div>
  );
}

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

export const WelcomeView = ({
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & WelcomeViewProps) => {
  return (
    <div ref={ref} className="mx-auto flex max-w-xl flex-col items-center px-4 py-8">
      <section className="bg-background flex flex-col items-center justify-center text-center">
        <LearningHeroIcon />

        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#5d6162]/35 bg-[#5d6162]/15 px-3.5 py-1 text-xs font-semibold text-[#53544c] shadow-2xs">
          <Sparkles className="size-3.5" />
          Learning & Literacy Voice Agent
        </div>

        <h1 className="text-foreground mb-1 text-3xl font-extrabold tracking-tight md:text-4xl">
          Saksham
        </h1>
        <p className="text-muted-foreground mb-3 text-sm font-semibold md:text-base">
          AI Voice Learning Assistant
        </p>

        <p className="text-muted-foreground mb-6 max-w-md text-sm leading-relaxed font-normal md:text-base">
          Practice reading, speaking, and literacy skills with your interactive voice AI companion.
        </p>

        {/* Learning workflow badges */}
        <div className="mb-8 flex max-w-md flex-wrap items-center justify-center gap-2">
          <div className="bg-card border-border text-foreground flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium shadow-2xs">
            <BookOpen className="size-3.5 text-[#73746c]" />
            Learn
          </div>
          <span className="text-muted-foreground text-xs font-bold">→</span>
          <div className="bg-card border-border text-foreground flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium shadow-2xs">
            <Mic className="size-3.5 text-[#73746c]" />
            Speak
          </div>
          <span className="text-muted-foreground text-xs font-bold">→</span>
          <div className="bg-card border-border text-foreground flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium shadow-2xs">
            <Volume2 className="size-3.5 text-[#73746c]" />
            Listen
          </div>
          <span className="text-muted-foreground text-xs font-bold">→</span>
          <div className="bg-card border-border text-foreground flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium shadow-2xs">
            <Sparkles className="size-3.5 text-[#73746c]" />
            Interact
          </div>
        </div>

        <Button
          size="lg"
          onClick={onStartCall}
          className="h-12 w-64 rounded-full border border-[#73746c]/30 bg-[#5d6162] text-sm font-bold tracking-wide text-white uppercase shadow-lg shadow-[#5d6162]/25 transition-all duration-200 hover:bg-[#73746c]"
        >
          {startButtonText}
        </Button>
      </section>

      <div className="fixed bottom-5 left-0 flex w-full items-center justify-center">
        <p className="text-muted-foreground max-w-prose pt-1 text-center text-xs leading-5 font-normal text-pretty md:text-sm"></p>
      </div>
    </div>
  );
};
