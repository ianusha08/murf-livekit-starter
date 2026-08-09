'use client';

import React from 'react';
import { type MotionProps, motion } from 'motion/react';
import { useVoiceAssistant } from '@livekit/components-react';
import { AgentAudioVisualizerAura } from '@/components/agents-ui/agent-audio-visualizer-aura';
import { AgentAudioVisualizerBar } from '@/components/agents-ui/agent-audio-visualizer-bar';
import { AgentAudioVisualizerGrid } from '@/components/agents-ui/agent-audio-visualizer-grid';
import { AgentAudioVisualizerRadial } from '@/components/agents-ui/agent-audio-visualizer-radial';
import { AgentAudioVisualizerWave } from '@/components/agents-ui/agent-audio-visualizer-wave';
import { cn } from '@/lib/shadcn/utils';

const MotionAgentAudioVisualizerAura = motion.create(AgentAudioVisualizerAura);
const MotionAgentAudioVisualizerBar = motion.create(AgentAudioVisualizerBar);
const MotionAgentAudioVisualizerGrid = motion.create(AgentAudioVisualizerGrid);
const MotionAgentAudioVisualizerRadial = motion.create(AgentAudioVisualizerRadial);
const MotionAgentAudioVisualizerWave = motion.create(AgentAudioVisualizerWave);

interface AudioVisualizerProps extends MotionProps {
  isChatOpen: boolean;
  audioVisualizerType?: 'bar' | 'wave' | 'grid' | 'radial' | 'aura';
  audioVisualizerColor?: `#${string}`;
  audioVisualizerColorShift?: number;
  audioVisualizerWaveLineWidth?: number;
  audioVisualizerGridRowCount?: number;
  audioVisualizerGridColumnCount?: number;
  audioVisualizerRadialBarCount?: number;
  audioVisualizerRadialRadius?: number;
  audioVisualizerBarCount?: number;
  className?: string;
}

export function AudioVisualizer({
  audioVisualizerType = 'bar',
  audioVisualizerColor,
  audioVisualizerColorShift = 0.3,
  audioVisualizerBarCount = 5,
  audioVisualizerRadialRadius = 100,
  audioVisualizerRadialBarCount = 25,
  audioVisualizerGridRowCount = 15,
  audioVisualizerGridColumnCount = 15,
  audioVisualizerWaveLineWidth = 3,
  isChatOpen,
  className,
  ...props
}: AudioVisualizerProps) {
  const { state, audioTrack } = useVoiceAssistant();

  switch (audioVisualizerType) {
    case 'aura': {
      return (
        <MotionAgentAudioVisualizerAura
          state={state}
          audioTrack={audioTrack}
          color={audioVisualizerColor}
          colorShift={audioVisualizerColorShift}
          className={cn('size-[120px] md:size-[150px]', className)}
          {...props}
        />
      );
    }
    case 'wave': {
      return (
        <motion.div className={className} {...props}>
          <MotionAgentAudioVisualizerWave
            state={state}
            audioTrack={audioTrack}
            color={audioVisualizerColor}
            colorShift={audioVisualizerColorShift}
            lineWidth={isChatOpen ? audioVisualizerWaveLineWidth * 2 : audioVisualizerWaveLineWidth}
            className="size-[120px] md:size-[150px]"
          />
        </motion.div>
      );
    }
    case 'grid': {
      const totalCount = audioVisualizerGridRowCount * audioVisualizerGridColumnCount;

      let size: 'icon' | 'sm' | 'md' | 'lg' | 'xl' = 'sm';
      if (totalCount < 100) {
        size = 'lg';
      } else if (totalCount < 200) {
        size = 'md';
      } else if (totalCount < 300) {
        size = 'sm';
      }

      return (
        <MotionAgentAudioVisualizerGrid
          size={size}
          state={state}
          color={audioVisualizerColor}
          audioTrack={audioTrack}
          rowCount={audioVisualizerGridRowCount}
          columnCount={audioVisualizerGridColumnCount}
          radius={Math.round(
            Math.min(audioVisualizerGridRowCount, audioVisualizerGridColumnCount) / 4
          )}
          className={cn('size-[140px] gap-0 p-4 *:place-self-center md:size-[180px]', className)}
          {...props}
        />
      );
    }
    case 'radial': {
      return (
        <motion.div className={className} {...props}>
          <MotionAgentAudioVisualizerRadial
            size="md"
            state={state}
            color={audioVisualizerColor}
            audioTrack={audioTrack}
            radius={audioVisualizerRadialRadius}
            barCount={audioVisualizerRadialBarCount}
            className="size-[160px]"
          />
        </motion.div>
      );
    }
    default: {
      let size: 'icon' | 'sm' | 'md' | 'lg' | 'xl' = 'sm';
      let sizedClassName = cn(
        'h-12 w-auto items-center justify-center gap-2.5 *:min-h-[10px] *:w-[12px]',
        className
      );

      if (audioVisualizerBarCount <= 5) {
        size = 'sm';
        sizedClassName = cn(
          'h-12 w-auto items-center justify-center gap-2.5 *:min-h-[10px] *:w-[12px]',
          className
        );
      } else if (audioVisualizerBarCount <= 10) {
        size = 'sm';
        sizedClassName = cn(
          'h-12 w-auto items-center justify-center gap-2 *:min-h-[8px] *:w-[9px]',
          className
        );
      } else if (audioVisualizerBarCount <= 15) {
        size = 'sm';
        sizedClassName = cn(
          'h-10 w-auto items-center justify-center gap-1.5 *:min-h-[6px] *:w-[7px]',
          className
        );
      } else if (audioVisualizerBarCount <= 30) {
        size = 'icon';
        sizedClassName = cn(
          'h-8 w-auto items-center justify-center gap-1 *:min-h-[4px] *:w-[5px]',
          className
        );
      }

      return (
        <MotionAgentAudioVisualizerBar
          size={size}
          state={state}
          color={audioVisualizerColor}
          audioTrack={audioTrack}
          barCount={audioVisualizerBarCount}
          className={sizedClassName}
          {...props}
        >
          <span className="min-h-2.5 w-3 rounded-full bg-current/15 transition-colors duration-250 ease-linear data-[lk-highlighted=true]:bg-current" />
        </MotionAgentAudioVisualizerBar>
      );
    }
  }
}
