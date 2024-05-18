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
  const path23 = process.env.NEXT_PUBLIC_BUILDING_DATA_URL_23;
  const path24 = process.env.NEXT_PUBLIC_BUILDING_DATA_URL_24;
  const [cityDatas23, setCityDatas23] = useState<BuildingData[]>([]);
  const [cityDatas24, setCityDatas24] = useState<BuildingData[]>([]);
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
    const { x, y } = latLonToMeters(gps.lat, gps.lon);
    if (!gps.lat || !gps.lon) return;
    const elevationUrl = `https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php?lon=${gps.lon}&lat=${gps.lat}&outtype=JSON`;
    fetch(elevationUrl)
      .then((response) => response.json())
      .then((data) => {
        setBias(new Vector3(x, y, data.elevation));
      })
      .catch((error: Error) => {
        console.error('Error:', error);
        setBias(new Vector3(x, y, 0));
      });
  }, [gps]);

  useEffect(() => {
    fetch(`${path23}`)
      .then((response) => response.json())
      .then((data: any[]) => {
        let buildingDatas: BuildingData[] = [];
        data.forEach((d) => {
          let locations: Vector3[] = [];
          d.location.forEach((l: DefaultLocation) => {
            if (l.lat <= 35.1875 && l.lat >= 35.18) {
              const { x, y } = latLonToMeters(+l.lat, +l.lon);
              const { height } = l;
              const location: Vector3 = new Vector3(x, y, height);
              locations.push(location);
            }
          });
          const buildingData: BuildingData = {
            id: d.id,
            locations: locations,
          };
          buildingDatas.push(buildingData);
        });
        setCityDatas23(buildingDatas);
      });
  }, [path23, setCityDatas23]);

  useEffect(() => {
    fetch(`${path24}`)
      .then((response) => response.json())
      .then((data: any[]) => {
        let buildingDatas: BuildingData[] = [];
        data.forEach((d) => {
          let locations: Vector3[] = [];
          d.location.forEach((l: DefaultLocation) => {
            if (l.lat <= 35.1875 && l.lat >= 35.18) {
              const { x, y } = latLonToMeters(+l.lat, +l.lon);
              const { height } = l;
              const location: Vector3 = new Vector3(x, y, height);
              locations.push(location);
            }
          });
          const buildingData: BuildingData = {
            id: d.id,
            locations: locations,
          };
          buildingDatas.push(buildingData);
        });
        setCityDatas24(buildingDatas);
      });
  }, [path24, setCityDatas24]);

  return (
    <>
      <ARButton />
      <Canvas style={{ width: '100vw', height: '100vh' }}>
        <ThreeCamera cameraPosition={cameraPosition} setCameraPosition={setCameraPosition} />
        <CameraPosition point={new Vector3(0, 16, 0)} />
        {cityDatas23.map((cityData) => {
          const points = cityData.locations.map((location) => {
            return new Vector3(location.x - bias.x, location.z - bias.z, -(location.y - bias.y));
          });
          if (points.length === 0) return;
          return <CanvasComponent key={cityData.id} points={points} />;
        })}
        {cityDatas24.map((cityData) => {
          const points = cityData.locations.map((location) => {
            return new Vector3(location.x - bias.x, location.z - bias.z, -(location.y - bias.y));
          });
          if (points.length === 0) return;
          return <CanvasComponent key={cityData.id} points={points} />;
        })}
        <EffectComposer>
          <SSAO />
        </EffectComposer>
      </Canvas>
    </>
  );
}
