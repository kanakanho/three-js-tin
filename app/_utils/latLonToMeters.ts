import { MathUtils } from 'three';

// Function to convert lat lon to meters
export function latLonToMeters(lat: number, lon: number) {
  const earthRadius = 6378137;
  const dLat = MathUtils.degToRad(lat);
  const dLon = MathUtils.degToRad(lon);
  const x = earthRadius * dLon;
  const y = earthRadius * Math.log(Math.tan(Math.PI * 0.25 + 0.5 * dLat));
  return { x, y };
}
