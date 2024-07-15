"use client";
import { Canvas } from "@react-three/fiber";
import { ARButton } from "@react-three/xr";
import { useEffect, useState } from "react";
import { Vector3 } from "three";
import { CanvasComponent } from "../_components/Canavs";
import type { BuildingData, DefaultLocation } from "../_types/Building";
import { latLonToMeters } from "../_utils/latLonToMeters";

type GPSLocation = {
  lat: number;
  lon: number;
};

export default function Home() {
  const [cameraPosition, setCameraPosition] = useState<Vector3>(new Vector3(0, 0, 0));
  const basePath = process.env.NEXT_PUBLIC_BUILDING_DATA_PATH;
  const pathAit = `${basePath}52376028_bldg_6697_op.json`;
  const [cityDatasAit, setCityDatasAit] = useState<BuildingData[]>([]);
  const [bias, setBias] = useState<Vector3>(new Vector3(0, 0, 0));

  const [gps, setGPS] = useState<GPSLocation>({ lat: 0, lon: 0 });
  const humanHeight = 1.6;

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition((position) => {
      setGPS({ lat: position.coords.latitude, lon: position.coords.longitude });
    });

    // Cleanup function to stop watching the GPS when the component unmounts
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (!gps.lat || !gps.lon) return;
    const { x, y } = latLonToMeters(gps.lat, gps.lon);
    const elevationUrl = `https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php?lon=${gps.lon}&lat=${gps.lat}&outtype=JSON`;
    fetch(elevationUrl)
      .then((response) => response.json())
      .then((data) => {
        setBias(new Vector3(x, y, data.elevation + humanHeight));
      })
      .catch((error: Error) => {
        console.error("Error:", error);
        setBias(new Vector3(x, y, 0));
      });
  }, [gps]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetch(`${pathAit}`)
      .then((response) => response.json())
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      .then((data: any[]) => {
        const buildingDatas: BuildingData[] = [];
        // biome-ignore lint/complexity/noForEach: <explanation>
        data.forEach((d) => {
          const locations: Vector3[] = [];
          // biome-ignore lint/complexity/noForEach: <explanation>
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
        setCityDatasAit(buildingDatas);
      });
  }, [pathAit, setCityDatasAit]);

  return (
    <>
      <ARButton />
      <Canvas style={{ width: "100vw", height: "100vh" }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} />
        {cityDatasAit.map((cityData) => {
          const points = cityData.locations.map((location) => {
            return new Vector3(location.x - bias.x, location.z - bias.z, -(location.y - bias.y));
          });
          if (points.length === 0) return;
          return <CanvasComponent key={cityData.id} points={points} />;
        })}
      </Canvas>
    </>
  );
}
