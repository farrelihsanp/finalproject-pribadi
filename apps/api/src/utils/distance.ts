import { getDistance } from 'geolib';

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  return getDistance(
    { latitude: lat1, longitude: lon1 },
    { latitude: lat2, longitude: lon2 },
  );
}

console.log(
  calculateDistance(
    -6.289169504340975,
    106.83223534481418,
    -6.260141963529325,
    106.81227233555877,
  ),
);
