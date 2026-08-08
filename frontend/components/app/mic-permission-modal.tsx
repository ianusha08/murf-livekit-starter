'use client';

import React from 'react';
import { motion } from 'motion/react';
import { MicOff, Lock, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface MicPermissionModalProps {
  onRetry: () => void;
  onClose?: () => void;
}

export function MicPermissionModal({ onRetry, onClose }: MicPermissionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-md bg-card border border-destructive/30 rounded-2xl p-6 shadow-2xl text-card-foreground flex flex-col items-center text-center space-y-4"
      >
        <div className="size-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
          <MicOff className="size-7" />
        </div>

        <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight flex items-center justify-center gap-2">
              Microphone Permission Denied
            </h3>
          <p className="text-xs text-muted-foreground">
            We couldn't access your microphone. Please enable microphone permission in your browser settings so the assistant can hear your voice.
          </p>
        </div>

        <div className="w-full bg-muted/60 rounded-xl p-4 text-left text-xs space-y-2 border border-border/50">
          <div className="font-semibold text-foreground flex items-center gap-1.5 mb-1">
            <Lock className="size-3.5 text-amber-500" />
            How to enable your microphone:
          </div>
          <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground font-normal">
            <li>
              Look at your browser&apos;s address bar and click the <strong>Lock / Settings icon</strong>.
            </li>
            <li>
              Find <strong>Microphone</strong> in the permissions list and change it to <strong>Allow</strong>.
            </li>
            <li>
              Click <strong>Try Again</strong> below to re-connect.
            </li>
          </ol>
        </div>

        <div className="flex items-center gap-2 w-full pt-2">
          {onClose && (
            <Button variant="outline" size="default" className="flex-1" onClick={onClose}>
              Dismiss
            </Button>
          )}
          <Button
            size="default"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-2"
            onClick={onRetry}
          >
            <RefreshCw className="size-4" />
            Try Again
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
