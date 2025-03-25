'use client';

import React from 'react';
import { Spinner } from '@/components/ui/spinner';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Carregando...' }: LoadingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Spinner size="lg" className="mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
} 