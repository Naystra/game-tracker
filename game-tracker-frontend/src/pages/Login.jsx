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
    const [errors, setErrors] = useState([]);
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password
            });

            // Stockage du token
            localStorage.setItem("token", res.data.token);

            // Mettre à jour le context
            setUser(res.data.user);

            // Redirection
            navigate("/profile");

        } catch (err) {
            const data = err.response?.data;

            if (data?.errors) {
                setErrors(data.errors);
            } else {
                setErrorMessage(data?.message || "Identifiants invalides");
            }
        }
    };


    return (
        <>  
        <Header />
            <div className="login-container">
                <div className="login-card">
                    <h2>Connexion</h2>

                    <form onSubmit={handleSubmit}>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <button type="submit">Se connecter</button>
                    </form>

                    {errors.length > 0 && (
                        <div>
                            {errors.map((e, i) => (
                                <p key={i} className="login-register-text">{e.msg}</p>
                            ))}                      
                        </div>
                    )}

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