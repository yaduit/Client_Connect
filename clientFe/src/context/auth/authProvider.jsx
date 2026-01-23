import {useState, useEffect } from "react";
import { AuthContext } from "./authContext.js";

 const AuthProvider = ({children}) => {
    const[user, setUser] = useState(null);
    const[loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token")

        if(!token){
            setLoading(false);
            return;
        }

        try{
            //simple version//
            const payload = JSON.parse(atob(token.split(".")[1]));

            setUser({
                id: payload.id,
                role: payload.role,
                email: payload.email
            });
        }catch(err){
            console.error("Invalid token");
            localStorage.removeItem("token")
        }finally{
            setLoading(false)
        }
    },[]);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null)
    };

    return(
        <AuthContext.Provider value={{user, setUser, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;