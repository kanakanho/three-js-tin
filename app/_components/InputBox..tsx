import type React from "react";
import { type SetStateAction, useState } from "react";
import type GPSLocation from "../_types/GPSLocation";

type Props = {
  // eslint-disable-next-line no-unused-vars
  setGPS: (value: SetStateAction<GPSLocation>) => void;
};

export const InputBox: React.FC<Props> = ({ setGPS }) => {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  return (
    <>
      <input type="text" value={lat} onChange={(event) => setLat(event.target.value)} />
      <input type="text" value={lon} onChange={(event) => setLon(event.target.value)} />
      <button type="button" onClick={() => setGPS({ lat: Number(lat), lon: Number(lon) })}>
        決定
      </button>
    </>
  );
};
