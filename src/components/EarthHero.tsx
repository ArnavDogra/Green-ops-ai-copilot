/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

export default function EarthHero({ isDark = true }: { isDark?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const globeEl = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
    // Auto-rotate
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 1.5;
    }
  }, []);

  if (!mounted) return null;

  // Mock data for cloud regions
  const arcsData = [
    { startLat: 37.77, startLng: -122.41, endLat: 51.5, endLng: -0.12, color: '#4ade80' },
    { startLat: -33.86, startLng: 151.2, endLat: 35.67, endLng: 139.65, color: '#f87171' },
    { startLat: 1.35, startLng: 103.81, endLat: 40.71, endLng: -74.00, color: '#3b82f6' },
  ];

  const ringsData = [
    { lat: 37.77, lng: -122.41, maxR: 5, propagationSpeed: 2, repeatPeriod: 1000 },
    { lat: 51.5, lng: -0.12, maxR: 3, propagationSpeed: 1, repeatPeriod: 800 },
    { lat: -33.86, lng: 151.2, maxR: 4, propagationSpeed: 3, repeatPeriod: 1200 },
    { lat: 1.35, lng: 103.81, maxR: 5, propagationSpeed: 2, repeatPeriod: 900 },
    { lat: 35.67, lng: 139.65, maxR: 3, propagationSpeed: 1.5, repeatPeriod: 1100 },
    { lat: 40.71, lng: -74.00, maxR: 6, propagationSpeed: 2.5, repeatPeriod: 1500 },
  ];

  return (
    <div className="w-full h-full cursor-move rounded-full overflow-hidden neon-border" style={{boxShadow: '0 0 50px rgba(74,222,128,0.2)'}}>
      <Globe
        ref={globeEl}
        globeImageUrl={isDark ? "//unpkg.com/three-globe/example/img/earth-dark.jpg" : "//unpkg.com/three-globe/example/img/earth-day.jpg"}
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        arcsData={arcsData}
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={1500}
        ringsData={ringsData}
        ringColor={() => '#4ade80'}
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
        width={500}
        height={500}
      />
    </div>
  );
}
