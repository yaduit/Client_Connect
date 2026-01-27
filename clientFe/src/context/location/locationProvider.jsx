import { useEffect, useState } from "react";
import { LocationContext } from "./locationContext.js";

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(() => {
    if (!navigator.geolocation) {
      return {
        lat: null,
        lng: null,
        city: null,
        loading: false,
        error: "Geolocation not supported",
      };
    }

    return {
      lat: null,
      lng: null,
      city: null,
      loading: true,
      error: null,
    };
  });

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          city: null,
          loading: false,
          error: null,
        });
      },
      () => {
        setLocation({
          lat: null,
          lng: null,
          city: null,
          loading: false,
          error: "Location permission denied",
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
