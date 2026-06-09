import { useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";




const API_URL = import.meta.env.VITE_API_URL;



export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [slowServer, setSlowServer] = useState(false);
    
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { setLoading(false); return;} 

        const timer = setTimeout(() => setSlowServer(true), 3000);

        axios.get(`${API_URL}/api/users/me`, { headers: { Authorization: `Bearer ${token}` }})
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => {
                clearTimeout(timer);
                setSlowServer(false);
                setLoading(false);
            });                
    }, []);


    const login = async (token) => {
        localStorage.setItem("token", token);

        try {
            const res = await axios.get(`${API_URL}/api/users/me`, { headers: { Authorization: `Bearer ${token}` }});
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
        <UserContext.Provider value={{ user, setUser, loading, slowServer, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};