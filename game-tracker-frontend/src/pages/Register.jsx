import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";


// URL de l'API récupérée depuis les variables d'environnement
const API_URL = import.meta.env.VITE_API_URL;



function Register () {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword]= useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Récupération de la fonction login depuis le contexte global
    const { login } = useContext(UserContext);


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Réinitialise les erreurs et messages à chaque tentative
        setErrors({});
        setMessage("");

        // Validation côté client avant d'appeler l'API
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, { 
                username,
                email,
                password,
            });

            setMessage("Inscription réussi !");
            await login(res.data.token); // Connexion automatique avec le token renvoyé par l'API
            setTimeout(() => navigate("/"), 2000);     

        } catch (err) {
            const data = err.response?.data;

            if (data?.errors) {
                // Erreurs de validation renvoyées par le backend => affichage par champ
                const backendErrors = {};
                data.errors.forEach(e => {
                    backendErrors[e.param] = e.msg;
                });
                setErrors(backendErrors);               
            } else {
                // Erreur générale
                setMessage(data?.message || "Erreur lors de l'inscription");
            }           
        }
    };


    // Validation des champs côté client avant l'appel API
    const validate = () => {
        const newErrors = {};

        if (!username.trim() || username.trim().length < 3) {
            newErrors.username = "Minimum 3 caractères pour le Nom d'utilisateur";
        }

        if (!email.trim()) {
            newErrors.email = "Email obligatoire";
        } else if (!email.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.email = "Email invalide";
        }

        if (!password || password.length < 6) {
            newErrors.password = "Minimum 6 caractères pour le mot de passe";
        }

        return newErrors;
    };


    return (
        <>
            <Header />
            <div className="login-container">
                <div className="login-card">
                    <h2>Inscription</h2>

                    <form onSubmit={handleSubmit}>
                        {/* Affiche l'erreur du champ uniquement si elle existe */}
                        {errors.username && <p className="login-register-text">{errors.username}</p>}
                        <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)}/>

                        {errors.email && <p className="login-register-text">{errors.email}</p>} 
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>

                        {errors.password && <p className="login-register-text">{errors.password}</p>}
                        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)}/>


                        <button type="submit">S'inscrire</button>
                    </form>

                
                    {/* Message global affiché après soumission (succès ou erreur) */}
                    {message && <p className="login-register-text">{message}</p>}

                    <p className="login-register-text">Déjà un compte ?</p>
                    <button className="register-btn" type="button" onClick={() => navigate("/login")}>Se connecter</button>
                </div> 
            </div>
            <Footer />     
        </>
    );
}


export default Register;








