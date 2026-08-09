'use client';

import React from 'react';
import { AlertCircle, Lock, MicOff, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

export interface MicPermissionModalProps {
  onRetry: () => void;
  onClose?: () => void;
}

export function MicPermissionModal({ onRetry, onClose }: MicPermissionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-card border-destructive/30 text-card-foreground flex w-full max-w-md flex-col items-center space-y-4 rounded-2xl border p-6 text-center shadow-2xl"
      >
        <div className="bg-destructive/10 text-destructive flex size-14 items-center justify-center rounded-full">
          <MicOff className="size-7" />
        </div>

        <div className="space-y-1">
          <h3 className="flex items-center justify-center gap-2 text-xl font-bold tracking-tight">
            Microphone Permission Denied
          </h3>
          <p className="text-muted-foreground text-xs">
            We couldn't access your microphone. Please enable microphone permission in your browser
            settings so the assistant can hear your voice.
          </p>
        </div>

        <div className="bg-muted/60 border-border/50 w-full space-y-2 rounded-xl border p-4 text-left text-xs">
          <div className="text-foreground mb-1 flex items-center gap-1.5 font-semibold">
            <Lock className="size-3.5 text-amber-500" />
            How to enable your microphone:
          </div>
          <ol className="text-muted-foreground list-inside list-decimal space-y-1.5 font-normal">
            <li>
              Look at your browser&apos;s address bar and click the{' '}
              <strong>Lock / Settings icon</strong>.
            </li>
            <li>
              Find <strong>Microphone</strong> in the permissions list and change it to{' '}
              <strong>Allow</strong>.
            </li>
            <li>
              Click <strong>Try Again</strong> below to re-connect.
            </li>
          </ol>
        </div>

        <div className="flex w-full items-center gap-2 pt-2">
          {onClose && (
            <Button variant="outline" size="default" className="flex-1" onClick={onClose}>
              Dismiss
            </Button>
          )}
          <Button
            size="default"
            className="flex-1 gap-2 bg-emerald-600 font-medium text-white hover:bg-emerald-700"
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
