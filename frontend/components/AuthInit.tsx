'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store';

export function AuthInit() {
  const init = useAuthStore((state) => state.init);

  useEffect(() => {
    init();
  }, [init]);

  return null;
}
