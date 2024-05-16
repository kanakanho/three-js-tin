'use client';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, SSAO } from '@react-three/postprocessing';
import { ARButton } from '@react-three/xr';
import { useEffect, useState } from 'react';
import { Vector3 } from 'three';
import { CameraPosition } from './_components/CameraPosition';
import { CanvasComponent } from './_components/Canavs';
import { ThreeCamera } from './_components/ThreeCamera';
import { BuildingData, DefaultLocation } from './_types/Building';
import { latLonToMeters } from './_utils/latLonToMeters';

type GPSLocation = {
  lat: number;
  lon: number;
};

export default function Home() {
  const [cameraPosition, setCameraPosition] = useState<Vector3>(new Vector3(0, 0, 0));
  const path = process.env.NEXT_PUBLIC_BUILDING_DATA_URL;
  const [buildingDatas, setBuildingDatas] = useState<BuildingData[]>([]);
  const [bias, setBias] = useState<Vector3>(new Vector3(0, 0, 0));

  const [gps, setGPS] = useState<GPSLocation>({ lat: 0, lon: 0 });

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition((position) => {
      setGPS({ lat: position.coords.latitude, lon: position.coords.longitude });
    });

    // Cleanup function to stop watching the GPS when the component unmounts
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    console.log(buildingDatas);
  }, [buildingDatas]);

  useEffect(() => {
    // const { x, y } = latLonToMeters(gps.lat, gps.lon);
    const x = 15237835.6572;
    const y = 41866502.62523;
    setBias(new Vector3(x, y, 0));
  }, [gps]);

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
        <CameraPosition point={new Vector3(0, 0, 0)} />
        {buildingDatas.map((buildingData) => {
          const points = buildingData.locations.map((location) => {
            return new Vector3(location.x - bias.x, location.y - bias.y, location.z - bias.z);
          });
          return <CanvasComponent key={buildingData.id} points={points} />;
        })}
        <EffectComposer>
          <SSAO />
        </EffectComposer>
      </Canvas>
    </>
  );
}
