'use client';
import { useThree } from '@react-three/fiber';
import React, { useEffect } from 'react';
import { Vector3 } from 'three';

type Props = {
  point: Vector3;
};

export const CameraPosition: React.FC<Props> = ({ point }) => {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(point.x, point.y, point.z);
    console.log('camera position', camera.position);
  }, [point, camera.position]);
  return <></>;
};
