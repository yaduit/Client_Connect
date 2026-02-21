import { useState, useEffect } from "react";
import { getProviderByIdApi } from "../api/providers.api.js";

export const useProviderDetails = (providerId) => {
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProvider = async () => {
            try{
                setLoading(true);
                const data = await getProviderByIdApi(providerId);
                setProvider(data);
            }catch(error){
                setError('Failed to load Provider');
                console.log(error) ,{/* reomove later */}
            }finally{
                setLoading(false);
            }
        }
        fetchProvider();
    },[providerId]);

    return {provider, loading , error};
};
