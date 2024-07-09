"use client";
import { XR } from "@react-three/xr";
import type React from "react";
import { useEffect, useState } from "react";
import type { Vector3 } from "three";
import { TriangleComponent } from "./Triangle";

type Props = {
  points: Vector3[];
};

export const CanvasComponent: React.FC<Props> = ({ points }) => {
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
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <TriangleComponent key={index} vertices={vertices} />
        ))}
      </XR>
    </>
  );
};
