import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, Mic, Sparkles, Volume2 } from 'lucide-react';

function LearningHeroIcon() {
  return (
    <div className="relative mb-6 flex items-center justify-center">
      <div className="size-20 rounded-full bg-[#5d6162]/15 text-[#63645c] flex items-center justify-center shadow-md border border-[#5d6162]/30">
        <GraduationCap className="size-10" />
      </div>
      <div className="absolute -bottom-1 -right-1 bg-[#5d6162] text-white rounded-full p-1.5 shadow-md border border-[#73746c]/40">
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
    <div ref={ref} className="px-4 py-8 max-w-xl mx-auto flex flex-col items-center">
      <section className="bg-background flex flex-col items-center justify-center text-center">
        <LearningHeroIcon />

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#5d6162]/15 text-[#53544c] border border-[#5d6162]/35 mb-3 shadow-2xs">
          <Sparkles className="size-3.5" />
          Learning & Literacy Voice Agent
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-1">
          Saksham
        </h1>
        <p className="text-sm md:text-base font-semibold text-muted-foreground mb-3">
          AI Voice Learning Assistant
        </p>

        <p className="text-muted-foreground max-w-md text-sm md:text-base leading-relaxed mb-6 font-normal">
          Practice reading, speaking, and literacy skills with your interactive voice AI companion.
        </p>

        {/* Learning workflow badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-md">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium text-foreground shadow-2xs">
            <BookOpen className="size-3.5 text-[#73746c]" />
            Learn
          </div>
          <span className="text-muted-foreground text-xs font-bold">→</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium text-foreground shadow-2xs">
            <Mic className="size-3.5 text-[#73746c]" />
            Speak
          </div>
          <span className="text-muted-foreground text-xs font-bold">→</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium text-foreground shadow-2xs">
            <Volume2 className="size-3.5 text-[#73746c]" />
            Listen
          </div>
          <span className="text-muted-foreground text-xs font-bold">→</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium text-foreground shadow-2xs">
            <Sparkles className="size-3.5 text-[#73746c]" />
            Interact
          </div>
        </div>

        <Button
          size="lg"
          onClick={onStartCall}
          className="w-64 rounded-full bg-[#5d6162] hover:bg-[#73746c] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#5d6162]/25 border border-[#73746c]/30 h-12 uppercase transition-all duration-200"
        >
          {startButtonText}
        </Button>
      </section>

      <div className="fixed bottom-5 left-0 flex w-full items-center justify-center">
        <p className="text-muted-foreground max-w-prose pt-1 text-xs leading-5 font-normal text-pretty md:text-sm text-center">
        </p>
      </div>
    </div>
  );
};
