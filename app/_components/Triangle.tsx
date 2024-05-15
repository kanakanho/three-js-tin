'use client';
import React from 'react';
import * as THREE from 'three';

type Props = {
  vertices: THREE.Vector3[];
};

export const TriangleComponent: React.FC<Props> = ({ vertices }) => {
  const geometry = new THREE.BufferGeometry().setFromPoints(vertices);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={'red'} wireframe={false} side={THREE.DoubleSide} />
    </mesh>
  );
};
