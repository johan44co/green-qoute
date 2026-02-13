"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface InstallationMapProps {
  address: string;
  city: string;
  region?: string;
  zip: string;
  country: string;
}

interface Coordinates {
  lat: number;
  lon: number;
}

export function InstallationMap({
  address,
  city,
  region,
  zip,
  country,
}: InstallationMapProps) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fix marker icon in client-side only
  useEffect(() => {
    (async () => {
      const L = (await import("leaflet")).default;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
    })();
  }, []);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        // Construct full address for geocoding
        const fullAddress = [address, city, region, zip, country]
          .filter(Boolean)
          .join(", ");

        // Use Nominatim (OpenStreetMap's geocoding service)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            fullAddress
          )}&limit=1`
        );

        const data = await response.json();

        if (data && data.length > 0) {
          setCoordinates({
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
          });
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [address, city, region, zip, country]);

  if (loading) {
    return (
      <div className="w-full h-full min-h-50 flex items-center justify-center bg-foreground/5">
        <p className="text-sm text-foreground/70">Loading map...</p>
      </div>
    );
  }

  if (error || !coordinates) {
    return (
      <div className="w-full h-full min-h-50 flex items-center justify-center bg-foreground/5">
        <p className="text-sm text-foreground/70">Map unavailable</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-50 overflow-hidden">
      <MapContainer
        center={[coordinates.lat, coordinates.lon]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coordinates.lat, coordinates.lon]}>
          <Popup>
            {address}
            <br />
            {city}, {region} {zip}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
