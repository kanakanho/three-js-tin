"use client";

import type React from "react";
import type { Vector3 } from "three";

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
