import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css";



function Register () {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword]= useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", { 
                username,
                email,
                password,
            });

            setMessage("Inscription réussi !");
            setTimeout(() => navigate("/login"), 2000);     

        } catch (err) {
            const data = err.response?.data;

            if (data?.errors) {
                setErrors(data.errors);
            } else {
                setMessage(data?.message || "Erreur lors de l'inscription");
            }           
        }
    };


    return (
        <>
            <Header />
            <div className="login-container">
                <div className="login-card">
                    <h2>Inscription</h2>

                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)}/>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>                                
                        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <button type="submit">S'inscrire</button>
                    </form>

                    {errors.length > 0 && (
                        <div>
                            {errors.map((e, i) => (
                                <p key={i} className="login-register-text">{e.msg}</p>
                            ))}
                        </div>
                    )}

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








