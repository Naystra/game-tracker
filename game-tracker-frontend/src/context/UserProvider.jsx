import { useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { setLoading(false); return;} 

        axios.get("http://localhost:5000/api/users/me", { headers: { Authorization: `Bearer ${token}` }})
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));                
    }, []);


    const login = async (token) => {
        localStorage.setItem("token", token);

        try {
            const res = await axios.get("http://localhost:5000/api/users/me", { headers: { Authorization: `Bearer ${token}` }});
            setUser(res.data);
        } catch {
            setUser(null);
        }
    };


    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user")
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, loading, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};