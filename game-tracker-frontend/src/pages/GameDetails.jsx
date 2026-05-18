import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/GameDetails.css"


function GameDetails() {
    const { id } = useParams(); // c'est le rawgId
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);

    
    const RAWG_API_KEY = "9ebc7ee0f1b3409cb9af5114cee81b81"


    useEffect(() => {
        const fetchGame = async () => {
            try {
            const res = await axios.get(`https://api.rawg.io/api/games/${id}?key=${RAWG_API_KEY}`);

            setGame(res.data);
        } catch (err) {
            console.error(err);
            alert("Erreur lors du chargement du jeu");
        } finally {
            setLoading(false);
        }
    };   

        fetchGame();
    }, [id]);

    if (loading) return <p>Chargement...</p>
    if (!game) return <p>Jeu introuvable</p>;


    return (
        <>
            <Header />
            <div className="game-details-container">
                <h1>{game.name}</h1>
                {game.background_image && (
                <img src={game.background_image} alt={game.name} /> )}

                <p><strong>Éditeur :</strong> {game.publishers?.map(p => p.name).join(", ")}</p>
                <p><strong>Plateformes :</strong> {game.platforms?.map(p => p.platform.name).join(", ")}</p>
                <p><strong>Score Metacritic :</strong> {game.metacritic || "N/A"}</p>
                <p><strong>Genres :</strong> {game.genres?.map(g => g.name).join(", ")}</p>
                <p><strong>Modes :</strong> {game.tags?.map(t => t.name).join(", ")}</p>
                <p><strong>Description :</strong> <span dangerouslySetInnerHTML={{__html: game.description}} /></p>
            </div>
            <Footer />
        </>
    );
}

export default GameDetails;