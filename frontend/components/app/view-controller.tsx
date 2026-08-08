'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { AnimatePresence, motion } from 'motion/react';
import { useSessionContext, useAgent } from '@livekit/components-react';
import type { AppConfig } from '@/app-config';
import { AgentSessionView_01 } from '@/components/agents-ui/blocks/agent-session-view-01';
import { WelcomeView } from '@/components/app/welcome-view';
import { SessionEndedView } from '@/components/app/session-ended-view';
import { MicPermissionModal } from '@/components/app/mic-permission-modal';
import { Loader2 } from 'lucide-react';

const MotionWelcomeView = motion.create(WelcomeView);
const MotionSessionView = motion.create(AgentSessionView_01);
const MotionEndedView = motion.create(SessionEndedView);

const VIEW_MOTION_PROPS = {
  variants: {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
  transition: {
    duration: 0.4,
    ease: 'easeInOut',
  },
};

interface ViewControllerProps {
  appConfig: AppConfig;
}

export function ViewController({ appConfig }: ViewControllerProps) {
  const { isConnected, connectionState, start } = useSessionContext();
  const { resolvedTheme } = useTheme();
  const { state: agentState } = useAgent();

  const [hasEndedSession, setHasEndedSession] = useState(false);
  const [micError, setMicError] = useState(false);
  const wasConnectedRef = useRef(false);

  // Monitor connection transitions to detect when call ends
  useEffect(() => {
    if (isConnected) {
      wasConnectedRef.current = true;
    } else if (wasConnectedRef.current && connectionState === 'disconnected') {
      setHasEndedSession(true);
      wasConnectedRef.current = false;
    }
  }, [isConnected, connectionState]);

  const handleStartCall = async () => {
    setHasEndedSession(false);
    setMicError(false);

    // Verify microphone permission state before starting if browser supports permission query
    if (typeof navigator !== 'undefined' && navigator.permissions?.query) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (permissionStatus.state === 'denied') {
          setMicError(true);
          return;
        }
      } catch {
        // Fallback for browsers that don't support mic permissions query
      }
    }

    try {
      await start();
    } catch (err: any) {
      if (
        err?.name === 'NotAllowedError' ||
        err?.name === 'PermissionDeniedError' ||
        err?.message?.toLowerCase().includes('permission') ||
        err?.message?.toLowerCase().includes('microphone')
      ) {
        setMicError(true);
      } else {
        console.error('Connection error:', err);
      }
    }
  };

  const isConnecting = connectionState === 'connecting';
  const showWelcome = !isConnected && !isConnecting && !hasEndedSession;
  const showConnecting = isConnecting;
  const showSession = isConnected && !hasEndedSession;
  const showEnded = !isConnected && !isConnecting && hasEndedSession;

  return (
    <>
      <AnimatePresence mode="wait">
        {/* State 1: Ready (Welcome view) */}
        {showWelcome && (
          <MotionWelcomeView
            key="welcome"
            {...VIEW_MOTION_PROPS}
            startButtonText={appConfig.startButtonText}
            onStartCall={handleStartCall}
          />
        )}

        {/* State 2: Connecting View */}
        {showConnecting && (
          <motion.div
            key="connecting"
            {...VIEW_MOTION_PROPS}
            className="flex flex-col items-center justify-center space-y-4 text-center p-6"
          >
            <div className="size-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Loader2 className="size-8 text-emerald-500 animate-spin" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Connecting to your Learning Assistant...
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Please wait a moment while we establish your voice session
              </p>
            </div>
          </motion.div>
        )}

        {/* States 3 & 4: Listening / Speaking / Active Session */}
        {showSession && (
          <MotionSessionView
            key="session-view"
            {...VIEW_MOTION_PROPS}
            supportsChatInput={appConfig.supportsChatInput}
            supportsVideoInput={appConfig.supportsVideoInput}
            supportsScreenShare={appConfig.supportsScreenShare}
            isPreConnectBufferEnabled={appConfig.isPreConnectBufferEnabled}
            audioVisualizerType={appConfig.audioVisualizerType}
            audioVisualizerColor={
              resolvedTheme === 'dark'
                ? appConfig.audioVisualizerColorDark
                : appConfig.audioVisualizerColor
            }
            audioVisualizerColorShift={appConfig.audioVisualizerColorShift}
            audioVisualizerBarCount={appConfig.audioVisualizerBarCount}
            audioVisualizerGridRowCount={appConfig.audioVisualizerGridRowCount}
            audioVisualizerGridColumnCount={appConfig.audioVisualizerGridColumnCount}
            audioVisualizerRadialBarCount={appConfig.audioVisualizerRadialBarCount}
            audioVisualizerRadialRadius={appConfig.audioVisualizerRadialRadius}
            audioVisualizerWaveLineWidth={appConfig.audioVisualizerWaveLineWidth}
            className="fixed inset-0"
          />
        )}

        {/* State 5: Call Ended View */}
        {showEnded && (
          <MotionEndedView
            key="call-ended"
            {...VIEW_MOTION_PROPS}
            onStartAgain={handleStartCall}
          />
        )}
      </AnimatePresence>

      {/* Step 4: Microphone Permission Error Modal */}
      {micError && (
        <MicPermissionModal
          onRetry={handleStartCall}
          onClose={() => setMicError(false)}
        />
      )}
    </>
  );
}
