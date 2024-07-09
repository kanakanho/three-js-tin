"use client";
import { useThree } from "@react-three/fiber";
import type React from "react";
import { useEffect } from "react";
import type { Vector3 } from "three";

type Props = {
  point: Vector3;
};

export const CameraPosition: React.FC<Props> = ({ point }) => {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(point.x, point.y, point.z);
  }, [point, camera.position]);
  return <></>;
};
