'use client';
import { XR } from '@react-three/xr';
import React, { useEffect, useState } from 'react';
import { Vector3 } from 'three';
import { BoxComponent } from './Box';
import { TriangleComponent } from './Triangle';

type Props = {
  points: Vector3[];
};

export const CanvasComponent: React.FC<Props> = ({ points }) => {
  //   console.log(points);
  const [polygonVertices, setPolygonVertices] = useState<Vector3[][]>([]);

  useEffect(() => {
    setPolygonVertices([points]);

    // 三角形の頂点を設定
    const triangleVertices = [];
    for (let i = 0; i < points.length; i += 3) {
      triangleVertices.push([points[i], points[i + 1], points[i + 2]]);
    }
  }, [points]);

  return (
    <>
      <XR>
        <ambientLight />
        {polygonVertices.map((vertices, index) => (
          <TriangleComponent key={index} vertices={vertices} />
        ))}
        {polygonVertices.map((vertices, index) => (
          <BoxComponent key={index} position={vertices[0]} />
        ))}
      </XR>
    </>
  );
};
