import { searchProvidersApi } from "../api/search.api.js";
import { useState, useEffect } from "react";
import { useLocation } from "../context/location/useLocation";

export const useTopServicesNearYou = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { location } = useLocation();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use location from context if available
        if (location?.lat && location?.lng) {
          const data = await searchProvidersApi({
            lat: location.lat,
            lng: location.lng,
            sort: "rating",
            limit: 6,
          });
          setProviders(data.providers || []);
        } else if (!navigator.geolocation) {
          setError("Geolocation is not supported");
        }
      } catch (error) {
        setError("Failed to load nearby services");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [location?.lat, location?.lng]);

  return { providers, loading, error };
};
