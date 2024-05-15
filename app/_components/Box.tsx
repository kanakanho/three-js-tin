'use client';

import React from 'react';
import { Vector3 } from 'three';

type Props = {
  position: Vector3;
};

export const BoxComponent: React.FC<Props> = ({ position }) => {
  const scaleNumber = 2;
  return (
    <mesh scale={[scaleNumber, scaleNumber, scaleNumber]} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial />
    </mesh>
  );
};
