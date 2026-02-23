import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

function UserProvider ({ children }) {
    const [user, setUser] = useState(null);

    const token = localStorage.getItem("token");


    // On récupère le user depuis l'API au chargement
    useEffect(() => {
        const fetchUser = async () => {
            if (!token) return;

            try {
                const res = await axios.get("http://localhost:5000/api/users/me", {headers: { Authorization: `Bearer ${token}`}});

                setUser(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUser();
    }, [token]);



    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;