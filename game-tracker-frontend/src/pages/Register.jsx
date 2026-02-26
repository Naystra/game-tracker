import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";



function Register () {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword]= useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { login } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});
        setMessage("");

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", { 
                username,
                email,
                password,
            });

            setMessage("Inscription réussi !");
            await login(res.data.token);
            setTimeout(() => navigate("/"), 2000);     

        } catch (err) {
            const data = err.response?.data;

            if (data?.errors) {
                const backendErrors = {};
                data.errors.forEach(e => {
                    backendErrors[e.param] = e.msg;
                });
                setErrors(backendErrors);               
            } else {
                setMessage(data?.message || "Erreur lors de l'inscription");
            }           
        }
    };


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
                        {errors.username && <p className="login-register-text">{errors.username}</p>}
                        <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)}/>

                        {errors.email && <p className="login-register-text">{errors.email}</p>} 
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>

                        {errors.password && <p className="login-register-text">{errors.password}</p>}
                        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)}/>


                        <button type="submit">S'inscrire</button>
                    </form>

                

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








