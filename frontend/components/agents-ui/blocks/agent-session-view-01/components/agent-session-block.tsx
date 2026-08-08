'use client';

import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { GraduationCap, PhoneOff, Sparkles } from 'lucide-react';
import { useAgent, useSessionContext, useSessionMessages } from '@livekit/components-react';
import { AgentChatTranscript } from '@/components/agents-ui/agent-chat-transcript';
import { AgentDisconnectButton } from '@/components/agents-ui/agent-disconnect-button';
import { AgentTrackToggle } from '@/components/agents-ui/agent-track-toggle';
import { LearningStateBanner } from '@/components/app/learning-state-banner';
import { cn } from '@/lib/shadcn/utils';
import { AudioVisualizer } from './audio-visualizer';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AgentSessionView_01Props {
  /**
   * Message shown before the first chat message is sent.
   * @default 'Learning Assistant is ready, speak your answer or ask a question!'
   */
  preConnectMessage?: string;
  /** Enables or disables chat input controls. @default true */
  supportsChatInput?: boolean;
  /** Enables or disables camera controls. @default true */
  supportsVideoInput?: boolean;
  /** Enables or disables screen sharing controls. @default true */
  supportsScreenShare?: boolean;
  /** Shows a pre-connect buffer state with a shimmer message before messages appear. @default true */
  isPreConnectBufferEnabled?: boolean;
  /** Selects the visualizer style rendered in the main tile area. */
  audioVisualizerType?: 'bar' | 'wave' | 'grid' | 'radial' | 'aura';
  /** Primary hex color used by supported audio visualizer variants. */
  audioVisualizerColor?: `#${string}`;
  /** Hue shift intensity used by certain visualizers. */
  audioVisualizerColorShift?: number;
  /** Number of bars when `audioVisualizerType` is `bar`. */
  audioVisualizerBarCount?: number;
  /** Number of rows when `audioVisualizerType` is `grid`. */
  audioVisualizerGridRowCount?: number;
  /** Number of columns when `audioVisualizerType` is `grid`. */
  audioVisualizerGridColumnCount?: number;
  /** Number of radial bars when `audioVisualizerType` is `radial`. */
  audioVisualizerRadialBarCount?: number;
  /** Base radius when `audioVisualizerType` is `radial`. */
  audioVisualizerRadialRadius?: number;
  /** Stroke width when `audioVisualizerType` is `wave`. */
  audioVisualizerWaveLineWidth?: number;
  /** Optional class name merged onto the outer container. */
  className?: string;
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function SakshamAvatar() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative flex items-center justify-center"
    >
      {/* Outer glow ring */}
      <div className="absolute size-[88px] rounded-full bg-emerald-500/10 animate-pulse" />
      {/* Avatar circle */}
      <div className="relative size-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
        <GraduationCap className="size-9 text-emerald-400" />
      </div>
      {/* Active indicator dot */}
      <span className="absolute bottom-0.5 right-0.5 size-3.5 rounded-full bg-emerald-500 border-2 border-background shadow-md shadow-emerald-500/50" />
    </motion.div>
  );
}

// ─── Transcript card ──────────────────────────────────────────────────────────

function TranscriptCard({
  agentState,
  messages,
  scrollAreaRef,
  preConnectMessage,
}: {
  agentState: any;
  messages: any[];
  scrollAreaRef: React.RefObject<HTMLDivElement | null>;
  preConnectMessage: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-xl mx-auto flex flex-col min-h-0"
    >
      <div className="flex items-center gap-2 px-1 mb-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Conversation
        </span>
        {messages.length > 0 && (
          <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded-full font-semibold">
            {messages.length}
          </span>
        )}
      </div>

      <div
        className="flex-1 overflow-y-auto rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm p-3 min-h-[120px] max-h-[220px] scroll-smooth"
        ref={scrollAreaRef}
      >
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs text-muted-foreground/60 pt-8 italic"
            >
              {preConnectMessage}
            </motion.p>
          ) : (
            <motion.div
              key="transcript"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <AgentChatTranscript
                agentState={agentState}
                messages={messages}
                className="[&_.is-user>div]:rounded-[18px] [&>div>div]:pt-0"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Controls bar ─────────────────────────────────────────────────────────────

function SessionControls({ onDisconnect }: { onDisconnect: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4, ease: 'easeOut' }}
      className="flex items-center justify-center gap-5"
    >
      {/* Mic toggle */}
      <div className="flex flex-col items-center gap-1.5">
        <AgentTrackToggle
          source="microphone"
          variant="outline"
          className="size-14 rounded-full border-2 border-white/15 bg-white/8 backdrop-blur-sm hover:bg-white/15 text-white transition-all duration-200 hover:scale-105 active:scale-95"
        />
        <span className="text-[10px] text-muted-foreground/70 font-medium">Microphone</span>
      </div>

      {/* End Call */}
      <div className="flex flex-col items-center gap-1.5">
        <button
          id="saksham-end-call"
          onClick={onDisconnect}
          aria-label="End call"
          className="size-14 rounded-full bg-red-500/90 hover:bg-red-500 border-2 border-red-400/30 flex items-center justify-center text-white shadow-lg shadow-red-500/30 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-red-500/50"
        >
          <PhoneOff className="size-5" />
        </button>
        <span className="text-[10px] text-muted-foreground/70 font-medium">End Call</span>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AgentSessionView_01({
  preConnectMessage = 'Learning Assistant is ready, speak your answer or ask a question!',
  supportsChatInput = true,
  supportsVideoInput = true,
  supportsScreenShare = true,
  isPreConnectBufferEnabled = true,

  audioVisualizerType = 'bar',
  audioVisualizerColor,
  audioVisualizerColorShift,
  audioVisualizerBarCount = 5,
  audioVisualizerGridRowCount,
  audioVisualizerGridColumnCount,
  audioVisualizerRadialBarCount,
  audioVisualizerRadialRadius,
  audioVisualizerWaveLineWidth,
  ref,
  className,
  ...props
}: React.ComponentProps<'section'> & AgentSessionView_01Props) {
  const session = useSessionContext();
  const { messages } = useSessionMessages(session);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { state: agentState } = useAgent();

  // Auto-scroll to bottom when new user message arrives
  useEffect(() => {
    const lastMessage = messages.at(-1);
    const lastMessageIsLocal = lastMessage?.from?.isLocal === true;
    if (scrollAreaRef.current && lastMessageIsLocal) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <section
      ref={ref}
      className={cn(
        'relative z-10 h-full w-full overflow-hidden bg-background',
        className
      )}
      {...props}
    >
      {/* ── Subtle background radial gradient ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 0%, oklch(0.55 0.15 155 / 0.08) 0%, transparent 70%)',
        }}
      />

      {/* ── Main content column ── */}
      <div className="relative z-10 flex h-full flex-col items-center justify-between px-4 pt-16 pb-8 md:pt-20 md:pb-12 gap-4">

        {/* ── TOP: Avatar + Name + Status ── */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0">
          <SakshamAvatar />

          {/* Name + role */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="flex flex-col items-center gap-1 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Saksham
            </h2>
            <p className="text-sm text-muted-foreground font-medium">AI Learning Assistant</p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
              <Sparkles className="size-3" />
              Learning &amp; Literacy
            </div>
          </motion.div>

          {/* Status banner */}
          <div className="w-full">
            <LearningStateBanner
              agentState={agentState}
              connectionState={session.connectionState}
            />
          </div>
        </div>

        {/* ── MIDDLE: Audio visualizer ── */}
        <div className="flex flex-1 items-center justify-center min-h-0 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.5, ease: 'easeOut' }}
            className="flex items-center justify-center"
          >
            <AudioVisualizer
              audioVisualizerType={audioVisualizerType}
              audioVisualizerColor={audioVisualizerColor}
              audioVisualizerColorShift={audioVisualizerColorShift}
              audioVisualizerBarCount={audioVisualizerBarCount}
              audioVisualizerRadialBarCount={audioVisualizerRadialBarCount}
              audioVisualizerRadialRadius={audioVisualizerRadialRadius}
              audioVisualizerGridRowCount={audioVisualizerGridRowCount}
              audioVisualizerGridColumnCount={audioVisualizerGridColumnCount}
              audioVisualizerWaveLineWidth={audioVisualizerWaveLineWidth}
              isChatOpen={false}
              className="rounded-[50px] border border-transparent"
              style={{ color: audioVisualizerColor }}
            />
          </motion.div>
        </div>

        {/* ── BOTTOM HALF: Transcript + Controls ── */}
        <div className="flex flex-col gap-5 w-full max-w-xl flex-shrink-0">
          {/* Transcript */}
          <TranscriptCard
            agentState={agentState}
            messages={messages}
            scrollAreaRef={scrollAreaRef}
            preConnectMessage={preConnectMessage}
          />

          {/* Controls */}
          <SessionControls onDisconnect={session.end} />
        </div>
      </div>
    </section>
  );
}
