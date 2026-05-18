import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";




function Home () {
    const navigate = useNavigate();

    return (
        <>
        <Header />

        <div className="home-hero">
            <h1>Bienvenue sur Game Tracker</h1>
            <p>Suivez vos jeux, vos notes et vos statistiques facilement.</p>
            <button onClick={() => navigate("/login")}>Commencer</button>

            <img className="home-hero-image" src="/images/Home.png" alt="Jeux vidéo"/>
        </div>

        

        <div className="home-cards">
            <div className="home-card" onClick={() => navigate("/library")}>
                <h3>Ma collection</h3>
                <p>Consultez tous vos jeux et gérez vos notes et statuts.</p>
            </div>

            <div className="home-card" onClick={() => navigate("/search")}>
                <h3>Rechercher un jeu</h3>
                <p>Trouvez vos jeux préférés et ajoutez-les à votre collection.</p>
            </div>

            <div className="home-card" onClick={() => navigate("/stats")}>
                <h3>Mes statistiques</h3>
                <p>Visualisez vos progrès et votre collection grâce aux graphiques.</p>
            </div>
        </div>  

        <Footer />
        </>
    )
};

export default Home;