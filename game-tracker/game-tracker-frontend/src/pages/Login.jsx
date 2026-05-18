import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../styles/Login.css";



const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errors, setErrors] = useState({});
    const { login } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});
        setErrorMessage("");

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password
            });
            
            await login(res.data.token);
            navigate("/profile");

        } catch (err) {
            const data = err.response?.data;

            if (data?.errors) {
                const backendErrors = {};
                data.errors.forEach(e => {
                    backendErrors[e.param] = e.msg;
                });
                setErrors(backendErrors);
            } else {
                setErrorMessage(data?.message || "Identifiants invalides");
            }
        }
    };


    const validate = () => {
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = "Email obligatoire";
        } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.email = "Email invalide";
        }

        if (!password.trim()) {
            newErrors.password = "Mot de passe obligatoire";
        }

    return newErrors;
    };

    return (
        <>  
        <Header />
            <div className="login-container">
                <div className="login-card">
                    <h2>Connexion</h2>

                    <form onSubmit={handleSubmit}>
                        {errors.email && <p className="login-register-text">{errors.email}</p>}
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>

                        {errors.password && <p className="login-register-text">{errors.password}</p>}
                        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)}/>

                        <button type="submit">Se connecter</button>
                    </form>

                    {errorMessage && <p className="login-register-text">{errorMessage}</p>}

                    <p className="login-register-text">Pas encore de compte ?</p>
                    <button className="register-btn" type="button" onClick={() => navigate("/register")}>S'inscrire !</button>
                   

                </div>  
            </div>   
        <Footer />                 
        </>        
    );
};

export default Login;