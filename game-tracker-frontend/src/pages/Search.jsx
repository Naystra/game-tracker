import { useState } from "react";
import "../styles/Search.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";



const API_URL = import.meta.env.VITE_API_URL;
const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;



function Search () {
    const [search, setSearch]   = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    

    


    // Fonction appelée au submit
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!search) return;

        setLoading(true);
        try {
            const res = await axios.get(`https://api.rawg.io/api/games?search=${search}&key=${RAWG_API_KEY}`);
            setResults(res.data.results);
        } catch (err) {
            console.error(err);
            toast.error("Erreur lors de la recherche.");
        } finally {
            setLoading(false);
        }    
    };


    // Ajouter le jeu à la collection backend
    const handleAddGame = async (game) => {
        try {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Tu dois être connecté pour ajouter un jeu");
            return;
        }
        
            await axios.post(`${API_URL}/api/games`,
            {
                title: game.name,
                rawgId: game.id,
                status: "À faire",
                background_image: game.background_image
            },
            { headers: { Authorization: `Bearer ${token}`}}
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



    return (
        <>
        <Header />
          <div className="search-container">
            <h1 className="search-title">Rechercher un jeux </h1>

            <form className="search-form" onSubmit={handleSearch}>
                <input type="text" placeholder="Rechercher un jeu..." value={search} onChange={(e) => setSearch(e.target.value)}/>
                <button type="submit">Rechercher</button> 
            </form>

            {loading && <p className="search-info">Chargement...</p>}

            {!loading && results.length === 0 && search && <p className="search-info">Aucun jeu trouvé.</p>}

            {!loading && results.length > 0 && (
                <div className="search-grid">
                    {results.map((game) => (
                        <div className="search-card" key={game.id}> 
                            <Link to={`/game/${game.id}`}>
                                <img src={game.background_image || "/images/default-game.png"} alt={game.name} className="search-image"
                                style={{ width: "100%", borderRadius: "4px", objectFit: "cover" }}                           
                                />
                                <h3>{game.name}</h3>
                            </Link>
                            <p>Note moyenne : {game.rating || "N/A"}</p>
                            <button onClick={() => handleAddGame(game)}>Ajouter à ma collection</button>
                        </div>                      
                    ))}
                </div>             
              )}          
          </div> 
        <Footer />
        </>
    );
}

export default Search;