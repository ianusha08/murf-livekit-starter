'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Award, RotateCcw, BookOpen, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SessionEndedViewProps {
  onStartAgain: () => void;
}

export function SessionEndedView({ onStartAgain }: SessionEndedViewProps) {
  return (
    <section className="bg-background flex flex-col items-center justify-center text-center px-4 py-8 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center"
      >
        <div className="relative mb-6">
          <div className="size-20 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
            <Award className="size-10" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow">
            <CheckCircle2 className="size-4" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground tracking-tight mb-2">
          Learning Session Complete!
        </h2>

        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-6">
          Great job practicing reading and speaking with your AI assistant. Regular voice practice helps build confidence and literacy skills!
        </p>

        <div className="w-full bg-card border border-border rounded-xl p-4 mb-6 flex items-center justify-around text-left gap-4">
          <div className="flex items-center gap-3">
            <BookOpen className="size-5 text-emerald-500" />
            <div>
              <p className="text-xs text-muted-foreground">Track</p>
              <p className="text-xs font-semibold text-foreground">Learning & Literacy</p>
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 text-emerald-500" />
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Session Saved
              </p>
            </div>
          </div>
        </div>

        <Button
          size="lg"
          onClick={onStartAgain}
          className="w-64 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/20 gap-2 h-12"
        >
          <RotateCcw className="size-4" />
          Start Again
        </Button>
      </motion.div>
    </section>
  );
}
