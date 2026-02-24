import { useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get("http://localhost:5000/api/users/me",{headers: { Authorization: `Bearer ${token}`}});

                setUser(res.data);
            } catch (err) {
                console.error(err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);


    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};