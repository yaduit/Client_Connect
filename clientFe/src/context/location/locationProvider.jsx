import { useEffect, useState } from "react";
import { LocationContext } from "./locationContext.js";

export const LocationProvider = ({ children }) => {
  const [location, setLocationState] = useState(() => {
    if (!navigator.geolocation) {
      return {
        lat: null,
        lng: null,
        city: null,
        state: null,
        loading: false,
        error: "Geolocation not supported",
      };
    }

    return {
      lat: null,
      lng: null,
      city: null,
      state: null,
      loading: true,
      error: null,
    };
  });

  useEffect(() => {
    if (!navigator.geolocation || location.lat) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationState((prev) => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          loading: false,
          error: null,
        }));
      },
      () => {
        setLocationState((prev) => ({
          ...prev,
          loading: false,
          error: "Location permission denied",
        }));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [location.lat]);

  const setLocation = (newLocation) => {
    setLocationState(newLocation);
  };

  const value = {
    location,
    setLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
