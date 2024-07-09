"use client";
import { XR } from "@react-three/xr";
import type React from "react";
import { useEffect, useState } from "react";
import type { Vector3 } from "three";
import type THREE from "three";
import { BufferGeometry, DoubleSide } from "three";

type Props = {
  points: Vector3[];
};

export const CanvasComponent: React.FC<Props> = ({ points }) => {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry>();

  useEffect(() => {
    setGeometry(new BufferGeometry().setFromPoints(points));
  }, [points]);

  return (
    <XR>
      <ambientLight />
      <mesh geometry={geometry}>
        <meshBasicMaterial color={"black"} wireframe={true} side={DoubleSide} />
      </mesh>
    </XR>
  );
};
