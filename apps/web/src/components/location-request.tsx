// components/LocationRequest.tsx
import { useEffect, useState } from 'react';

interface LocationRequestProps {
  onLocationGranted: (position: GeolocationPosition) => void;
  onLocationDenied: () => void;
}

const LocationRequest: React.FC<LocationRequestProps> = ({
  onLocationGranted,
  onLocationDenied,
}) => {
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      onLocationDenied();
      return;
    }

    setRequesting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setRequesting(false);
        onLocationGranted(position);
      },
      () => {
        setRequesting(false);
        onLocationDenied();
      },
    );
  }, [onLocationGranted, onLocationDenied]);

  return (
    <div>
      {requesting && <p>Mohon berikan izin untuk mengakses lokasi Anda...</p>}
    </div>
  );
};

export default LocationRequest;
