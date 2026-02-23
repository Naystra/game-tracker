import { useState } from "react";
import "../styles/Search.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Search () {
    const [search, setSearch]   = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const RAWG_API_KEY = "9ebc7ee0f1b3409cb9af5114cee81b81";


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
            alert("Erreur lors de la recherche.")
        } finally {
            setLoading(false);
        }    
    };


    // Ajouter le jeu à la collection backend
    const handleAddGame = async (game) => {
        try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Tu dois être connecté pour ajouter un jeu");
            return;
        }
        
            await axios.post("http://localhost:5000/api/games",
            {
                title: game.name,
                rawgId: game.id,
                status: "À faire",
                rating: game.rating,
                background_image: game.background_image
            },
            { headers: { Authorization: `Bearer ${token}`}}
        );
        alert(`Tu as ajouté ${game.name} à ta collection !`);
        } catch (err) {
            if (err.response?.status === 400) {
                alert(err.response.data.message);
            } else {
                console.error(err);
                alert("Erreur lors de l'ajout du jeu.");
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
                            <img src={game.background_image || "/images/default-game.png"} alt={game.name} className="search-image"
                            style={{ width: "100%", borderRadius: "4px", height: "450px", objectFit: "cover" }}                           
                            />
                            <h3>{game.name}</h3>
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