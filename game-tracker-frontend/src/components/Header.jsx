import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";


function Header () {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <header className="header">
            <div className="logo-container" onClick={() => navigate("/")}>
                <img className="logo" src="/images/logo.jpg" alt="Game Tracker Logo"/>
            </div>
            
            <nav>
                <ul>
                    <li><Link to="/">Accueil</Link></li>
                    {!token && <li><Link to="/login">Connexion</Link></li>}
                    {token && <li><Link to="/stats">Stats</Link></li>}
                    <li><Link to="/library">Collections</Link></li>
                    <li><Link to="/profile">Profil</Link></li>
                    <li><Link to="/search">Rechercher</Link></li>
                </ul>
            </nav>

            <div className="header-right">
                {token && (
                    <>
                    
                    <Link to="/profile">
                    <img src={user?.avatar ? `http://localhost:5000/uploads/${user.avatar}` : `https://ui-avatars.com/api/?name=${user?.username}`} alt="avatar" className="avatar" />
                    </Link>

                    <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
                    </>
                )}
            </div>                                                                                          
        </header>
    )
}
export default Header;