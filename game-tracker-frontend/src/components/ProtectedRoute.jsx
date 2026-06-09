import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";


const ProtectedRoute = ({ children }) => {
    const { user, loading, slowServer } = useContext(UserContext);

    if (loading) return (
        <div style={{ textAlign: "center", marginTop: "5rem" }}>
            <p>Chargement...</p>
            {slowServer && (
                <p style={{ color: "#00e5ff", fontSize: "0.9rem" }}>
                    Le serveur se réveille, merci de patienter quelques secondes
                </p>
            )}
        </div>
    );
    
    if (!user) return <Navigate to="/login" replace />

    return children;
};

export default ProtectedRoute;