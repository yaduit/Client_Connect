import { searchProvidersApi } from "../api/search.api.js";
import { useState, useEffect } from "react";

export const useTopServicesNearYou = () => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if(!navigator.geolocation){
            setError("Geolocation is not supported ");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async(position) => {
                try{
                    const{latitude,longitude} = position.coords;
                    const data = await searchProvidersApi({
                        lat: latitude,
                        lng: longitude,
                        sort: 'rating',
                        limit: 6
                    });
                    setProviders(data.providers || []);
                }catch(error){
                    setError("Failed to load nearby services");
                    console.log(error); {/* remove later */}
                }finally{
                    setLoading(false);
                }
            },
            () => {
                setError("Location acess denied");
                setLoading(false);
            }
        );
    },[])

    return {providers, loading, error};
}