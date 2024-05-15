import { Vector3 } from 'three';

export type DefaultLocation = {
  lat: number;
  lon: number;
  height: number;
};

export type BuildingData = {
  id: string;
  locations: Vector3[];
};
