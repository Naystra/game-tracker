import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/GameDetails.css";
import toast from "react-hot-toast";
import DOMPurify from "dompurify";


function GameDetails() {
    const { id } = useParams(); // c'est le rawgId
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    
    const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;


    useEffect(() => {
        const fetchGame = async () => {
            try {
            const res = await axios.get(`https://api.rawg.io/api/games/${id}?key=${RAWG_API_KEY}`);
            setGame(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Erreur lors du chargement du jeu");
        } finally {
            setLoading(false);
        }
    };   

        fetchGame();
    }, [id]);


    
    // Function ajouter un jeux
     const handleAddGame = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Tu dois être connecté pour ajouter un jeu");
            return;
        }

        try {
            await axios.post("http://localhost:5000/api/games",
                {
                    title: game.name,
                    rawgId: game.id,
                    status: "À faire",
                    background_image: game.background_image
                },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            toast.success(`${game.name} ajouté à ta collection !`);
        } catch (err) {
            if (err.response?.status === 400) {
                toast.error(err.response.data.message);
            } else {
                console.error(err);
                toast.error("Erreur lors de l'ajout du jeu.");
            }
        }
    };


    if (loading) return <p>Chargement...</p>
    if (!game) return <p>Jeu introuvable</p>;


    return (
        <>
            <Header />
            <div className="game-details-container">

                <button className="back-btn" onClick={() => navigate(-1)}>← Retour</button>

                <h1>{game.name}</h1>
                {game.background_image && (
                <img src={game.background_image} alt={game.name} /> )}

                <p><strong>Éditeur :</strong> {game.publishers?.map(p => p.name).join(", ")}</p>
                <p><strong>Plateformes :</strong> {game.platforms?.map(p => p.platform.name).join(", ")}</p>
                <p><strong>Score Metacritic :</strong> {game.metacritic || "N/A"}</p>
                <p><strong>Genres :</strong> {game.genres?.map(g => g.name).join(", ")}</p>
                <p><strong>Modes :</strong> {game.tags?.map(t => t.name).join(", ")}</p>
                <p><strong>Description :</strong> <span dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(game.description)}} /></p>  

                <button className="add-btn" onClick={handleAddGame}>+ Ajouter à ma collection</button>

            </div>
            <Footer />
        </>
    );
}

export default GameDetails;