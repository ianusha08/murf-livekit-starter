'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ConnectionState } from 'livekit-client';
import { AgentState } from '@livekit/components-react';
import { Mic, Volume2, Sparkles, Loader2, StopCircle } from 'lucide-react';
import { cn } from '@/lib/shadcn/utils';

export interface LearningStateBannerProps {
  agentState: AgentState;
  connectionState: ConnectionState | 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | string;
  className?: string;
}

export function LearningStateBanner({
  agentState,
  connectionState,
  className,
}: LearningStateBannerProps) {
  // Determine state info
  let icon = <Mic className="size-5 animate-pulse text-emerald-500" />;
  let title = 'Listening to you';
  let subtitle = 'Speak clearly into your microphone';
  let badgeColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
  let isUserTurn = true;

  const isReconnecting =
    connectionState === ConnectionState.Reconnecting ||
    connectionState === ConnectionState.SignalReconnecting;

  const isConnectingOrReconnecting =
    connectionState === ConnectionState.Connecting || isReconnecting;

  if (isConnectingOrReconnecting) {
    icon = <Loader2 className="size-5 animate-spin text-amber-500" />;
    title = isReconnecting
      ? 'Reconnecting to your learning assistant...'
      : 'Connecting to your learning assistant...';
    subtitle = 'Please wait a moment';
    badgeColor = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
    isUserTurn = false;
  } else if (agentState === 'thinking') {
    icon = <Sparkles className="size-5 animate-bounce text-violet-500" />;
    title = 'Learning assistant is thinking...';
    subtitle = 'Processing your answer';
    badgeColor = 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30';
    isUserTurn = false;
  } else if (agentState === 'speaking') {
    icon = <Volume2 className="size-5 animate-pulse text-sky-500" />;
    title = 'Your learning assistant is speaking...';
    subtitle = 'Listen carefully';
    badgeColor = 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30';
    isUserTurn = false;
  } else if (agentState === 'disconnected' || connectionState === ConnectionState.Disconnected) {
    icon = <StopCircle className="size-5 text-rose-500" />;
    title = 'Session ended';
    subtitle = 'Click below to start again';
    badgeColor = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
    isUserTurn = false;
  }

  return (
    <div className={cn('w-full flex justify-center px-4 py-2 pointer-events-none z-30', className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={agentState + '-' + connectionState}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'flex items-center gap-3 px-5 py-2.5 rounded-full border shadow-md backdrop-blur-md transition-all duration-300',
            badgeColor
          )}
        >
          <div className="flex items-center justify-center">{icon}</div>
          <div className="flex flex-col text-left">
            <span className="text-xs md:text-sm font-semibold tracking-wide flex items-center gap-2">
              {title}
              {isUserTurn && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white uppercase tracking-wider animate-pulse">
                  Your Turn
                </span>
              )}
            </span>
            <span className="text-[11px] opacity-80 font-normal">{subtitle}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
