'use client';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, SSAO } from '@react-three/postprocessing';
import { ARButton } from '@react-three/xr';
import { useEffect, useState } from 'react';
import { MathUtils, Vector3 } from 'three';
import { CameraPosition } from './_components/CameraPosition';
import { CanvasComponent } from './_components/Canavs';
import { ThreeCamera } from './_components/ThreeCamera';
import { BuildingData, DefaultLocation } from './_types/Building';

// Function to convert lat lon to meters
function latLonToMeters(lat: number, lon: number) {
  const earthRadius = 6378137;
  const dLat = MathUtils.degToRad(lat);
  const dLon = MathUtils.degToRad(lon);
  const x = earthRadius * dLon;
  const y = earthRadius * Math.log(Math.tan(Math.PI * 0.25 + 0.5 * dLat));
  return { x, y };
}

export default function Home() {
  const [cameraPosition, setCameraPosition] = useState<Vector3>(new Vector3(0, 0, 0));
  const path = process.env.NEXT_PUBLIC_BUILDING_DATA_URL;
  const [buildingDatas, setBuildingDatas] = useState<BuildingData[]>([]);
  const [buildingCentroid, setBuildingCentroid] = useState<Vector3>(new Vector3(0, 0, 0));

  useEffect(() => {
    setBuildingCentroid(new Vector3(15237312, 4186921.75, 3.10448294878006));
  }, [buildingDatas]);

  useEffect(() => {
    fetch(`${path}`)
      .then((response) => response.json())
      .then((data: any[]) => {
        let buildingDatas: BuildingData[] = [];
        data.forEach((d) => {
          let locations: Vector3[] = [];
          d.location.forEach((l: DefaultLocation) => {
            const { x, y } = latLonToMeters(+l.lat, +l.lon);
            const { height } = l;
            const location: Vector3 = new Vector3(x, y, height);
            locations.push(location);
          });
          const buildingData: BuildingData = {
            id: d.id,
            locations: locations,
          };
          buildingDatas.push(buildingData);
        });
        setBuildingDatas(buildingDatas);
      });
  }, [path, setBuildingDatas]);
  return (
    <>
      <ARButton />
      <Canvas style={{ width: '100vw', height: '100vh' }}>
        <ThreeCamera cameraPosition={cameraPosition} setCameraPosition={setCameraPosition} />
        <CameraPosition point={buildingCentroid} />
        {buildingDatas.map((buildingData) => (
          <CanvasComponent key={buildingData.id} points={buildingData.locations} />
        ))}
        <EffectComposer>
          <SSAO />
        </EffectComposer>
      </Canvas>
    </>
  );
}
