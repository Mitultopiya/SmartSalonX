'use client';

import { useEffect, useRef } from 'react';

export default function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    if (!vantaRef.current) return;

    const initVanta = async () => {
      const THREE = await import('three');
      const NET = (await import('vanta/dist/vanta.net.min.js')).default;

      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }

      vantaEffect.current = NET({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x06b6d4,
        backgroundColor: 0x18181b,
        points: 12.0,
        maxDistance: 22.0,
        spacing: 17.0,
      });
    };

    initVanta();

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  return <div ref={vantaRef} className="fixed inset-0 -z-10" />;
}
