import { useState ,useEffect } from "react";
import {getCategoriesApi} from "../api/categories.api.js";

export const useCategories = () => {
    const[categories, setCategories] = useState([]);
    const[loading, setLoading] = useState(false);
    const[error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () =>{
            try{
                setLoading(true);
                const data = await getCategoriesApi();
                setCategories(data);
            }catch(err){
                setError('Failed to load categories',err.message);
            }finally{
                setLoading(false)
            }
        };
        fetchCategories();
    },[])
    return {categories, loading, error}
};