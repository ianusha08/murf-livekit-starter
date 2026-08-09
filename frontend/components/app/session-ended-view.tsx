'use client';

import React from 'react';
import { Award, BookOpen, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

function SessionEndedHeroIcon() {
  return (
    <div className="relative mb-6 flex items-center justify-center">
      <div className="flex size-20 items-center justify-center rounded-full border border-[#5d6162]/30 bg-[#5d6162]/15 text-[#63645c] shadow-md">
        <Award className="size-10" />
      </div>
      <div className="absolute -right-1 -bottom-1 rounded-full border border-[#73746c]/40 bg-[#5d6162] p-1.5 text-white shadow-md">
        <CheckCircle2 className="size-4" />
      </div>
    </div>
  );
}

export interface SessionEndedViewProps {
  onStartAgain: () => void;
}

export function SessionEndedView({ onStartAgain }: SessionEndedViewProps) {
  return (
    <section className="bg-background mx-auto flex max-w-xl flex-col items-center justify-center px-4 py-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center"
      >
        <SessionEndedHeroIcon />

        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#5d6162]/35 bg-[#5d6162]/15 px-3.5 py-1 text-xs font-semibold text-[#53544c] shadow-2xs">
          <Sparkles className="size-3.5" />
          Learning & Literacy Voice Agent
        </div>

        <h2 className="text-foreground mb-1 text-3xl font-extrabold tracking-tight md:text-4xl">
          Learning Session Complete!
        </h2>
        <p className="text-muted-foreground mb-3 text-sm font-semibold md:text-base">
          AI Voice Learning Assistant
        </p>

        <p className="text-muted-foreground mb-6 max-w-md text-sm leading-relaxed font-normal md:text-base">
          Great job practicing reading and speaking with your AI assistant. Regular voice practice
          helps build confidence and literacy skills!
        </p>

        <div className="bg-card border-border mb-6 flex w-full items-center justify-around gap-4 rounded-xl border p-4 text-left shadow-2xs">
          <div className="flex items-center gap-3">
            <BookOpen className="size-5 text-[#73746c]" />
            <div>
              <p className="text-muted-foreground text-xs">Track</p>
              <p className="text-foreground text-xs font-semibold">Learning & Literacy</p>
            </div>
          </div>
          <div className="bg-border h-8 w-px" />
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 text-[#73746c]" />
            <div>
              <p className="text-muted-foreground text-xs">Status</p>
              <p className="text-xs font-semibold text-[#63645c]">Session Saved</p>
            </div>
          </div>
        </div>

        <Button
          size="lg"
          onClick={onStartAgain}
          className="flex h-12 w-64 items-center justify-center gap-2 rounded-full border border-[#73746c]/30 bg-[#5d6162] text-sm font-bold tracking-wide text-white uppercase shadow-lg shadow-[#5d6162]/25 transition-all duration-200 hover:bg-[#73746c]"
        >
          <RotateCcw className="size-4" />
          START AGAIN
        </Button>
      </motion.div>
    </section>
  );
}
