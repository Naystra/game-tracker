import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";


function Header () {
    const { user, loading, setUser } = useContext(UserContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();


    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };

    if (loading) return <p>Chargement...</p>;



    return (
        <header className="header">
            <div className="logo-container" onClick={() => navigate("/")}>
                <img className="logo" src="/images/logo.jpg" alt="Game Tracker Logo"/>
            </div>

            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </button>
            
            <nav className={menuOpen ? "open" : ""}>
                <ul>
                    <li><Link to="/" onClick={() => setMenuOpen(false)}>Accueil</Link></li>
                    {!user && <li><Link to="/login" onClick={() => setMenuOpen(false)}>Connexion</Link></li>}
                    {user && <li><Link to="/stats" onClick={() => setMenuOpen(false)}>Stats</Link></li>}
                    <li><Link to="/library" onClick={() => setMenuOpen(false)}>Collections</Link></li>
                    <li><Link to="/profile" onClick={() => setMenuOpen(false)}>Profil</Link></li>
                    <li><Link to="/search" onClick={() => setMenuOpen(false)}>Rechercher</Link></li>

                    {user && (
                        <li className="menu-user">
                            <Link to="/profile" onClick={() => setMenuOpen(false)}>
                                <img src={user.avatar
                                    ? `http://localhost:5000/uploads/${user.avatar}`
                                    : `https://ui-avatars.com/api/?name=${user.username}`}
                                alt="avatar" className="avatar" />
                                <span>{user.username}</span>
                            </Link>
                            <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>                                                          
                        </li>
                    )}
                </ul>
            </nav>

            <div className="header-right">
                {user && (
                    <>
                    
                    <Link to="/profile">
                        <img src={user.avatar 
                            ? `http://localhost:5000/uploads/${user.avatar}` 
                            : `https://ui-avatars.com/api/?name=${user.username}`} 
                        alt="avatar" className="avatar" />
                    </Link>

                    <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
                    </>
                )}
            </div>                                                                                          
        </header>
    )
}
export default Header;