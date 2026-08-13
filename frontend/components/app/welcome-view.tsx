import React from 'react';
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
          className="h-12 w-64 rounded-full border border-[#73746c]/30 bg-[#5d6162] text-sm font-bold tracking-wide text-white uppercase shadow-lg shadow-[#5d6162]/25 transition-all duration-200 hover:bg-[#73746c] mb-12"
        >
          {startButtonText}
        </Button>

        {/* Localhost Call Analytics Widget */}
        <div className="w-full max-w-md rounded-2xl border border-[#5d6162]/25 bg-[#5d6162]/5 p-6 shadow-md">
          <h2 className="text-foreground text-lg font-bold tracking-tight mb-1">
            Saksham — Call Analytics
          </h2>
          <p className="text-muted-foreground text-xs mb-6">
            Learning & Literacy · Voice for Bharat
          </p>

          <AnalyticsDashboardWidget />
        </div>
      </section>

      <div className="fixed bottom-5 left-0 flex w-full items-center justify-center">
        <p className="text-muted-foreground max-w-prose pt-1 text-center text-xs leading-5 font-normal text-pretty md:text-sm"></p>
      </div>
    </div>
  );
};

function AnalyticsDashboardWidget() {
  const [metrics, setMetrics] = React.useState<{ total: number; successful: number; failed: number } | null>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchMetrics = React.useCallback(async () => {
    try {
      const res = await fetch("/api/metrics", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchMetrics();
    const id = setInterval(fetchMetrics, 5000);
    const onVisChange = () => {
      if (document.visibilityState === "visible") fetchMetrics();
    };
    document.addEventListener("visibilitychange", onVisChange);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisChange);
    };
  }, [fetchMetrics]);

  if (loading) {
    return <p className="text-[#73746c] text-xs">Loading analytics...</p>;
  }

  const m = metrics || { total: 0, successful: 0, failed: 0 };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#5d6162]/20 bg-[#5d6162]/10 p-3">
          <span className="text-[10px] font-bold text-[#73746c] tracking-wider uppercase">Total</span>
          <span className="text-2xl font-extrabold text-foreground mt-1">{m.total}</span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#5d6162]/20 bg-[#5d6162]/10 p-3">
          <span className="text-[10px] font-bold text-[#73746c] tracking-wider uppercase">Successful</span>
          <span className="text-2xl font-extrabold text-emerald-600 mt-1">{m.successful}</span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#5d6162]/20 bg-[#5d6162]/10 p-3">
          <span className="text-[10px] font-bold text-[#73746c] tracking-wider uppercase">Failed</span>
          <span className="text-2xl font-extrabold text-red-500 mt-1">{m.failed}</span>
        </div>
      </div>
      <button
        onClick={fetchMetrics}
        className="w-full rounded-lg border border-[#73746c]/30 bg-[#5d6162]/20 text-[#53544c] hover:bg-[#5d6162]/30 text-xs font-semibold py-2 transition-all duration-200"
      >
        Refresh Data
      </button>
    </div>
  );
}
