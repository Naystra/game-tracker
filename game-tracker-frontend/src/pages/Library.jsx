import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/Library.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";


const API_URL = import.meta.env.VITE_API_URL;



function Library() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [searchGames, setSearchGames] = useState("");
  const debounceTimers = useRef({});


  const token = localStorage.getItem("token");


  const fetchGames = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/games`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGames(res.data);

    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement de la collection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);



  // Fonction pour mettre à jour la note d'un jeu avec un délai (debounce) 
  const handleRatingChange = (id, value) => {
    // Met à jour l'affichage immédiatement avec la nouvelle note
    setGames(games.map((g) => (g._id === id ? { ...g, rating: value } : g)));

    // Annule le timer précédent pour éviter plusieurs appels API 
    if (debounceTimers.current[id]) {
      clearTimeout(debounceTimers.current[id]);
    }

    // Attend 500ms après la dernière frappe avant d'envoyer la requête à l'API
    debounceTimers.current[id] = setTimeout(() => {
      handleUpdate(id, "rating", Number(value));
    }, 500);
  };



  // Fonction pour supprimer :
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce jeu ?")) return;
    try {
      await axios.delete(`${API_URL}/api/games/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGames(games.filter((game) => game._id !== id));
      toast.success("Jeu supprimé de votre collection.");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression du jeu.");
    }
  };


  // Fonction pour modifier :
  const handleUpdate = async (id, field, value) => {
    try {
      const res = await axios.put(`${API_URL}/api/games/${id}`,{ [field]: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGames(games.map((g) => (g._id === id ? res.data : g)));
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  if (loading) return <p>Chargement...</p>;

  // Filtrage par statut
  const filteredGames = games
  .filter((game) => filterStatus === "Tous" ? true : game.status === filterStatus)
  .filter((game) => game.title.toLowerCase().includes(searchGames.toLocaleLowerCase()));

  

  return (
    <>
      <Header />

      <h1 className="library-title">Ma collection de jeux</h1>

      <div className="library-filters">
        <input type="text" placeholder="Rechercher un jeu..." value={searchGames} onChange={(e) => setSearchGames(e.target.value)}/>

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="Tous">Tous</option>
          <option value="À faire">À faire</option>
          <option value="En cours">En cours</option>
          <option value="Fini">Fini</option>
        </select>
      </div>

      {filteredGames.length === 0 ? (
        <p className="library-empty">Aucun jeu ne correspond à votre recherche.</p>
      ) : (
        <div className="library-grid">
          {filteredGames.map((game) => (
            <div key={game._id} className="game-card">
                <Link  to={`/game/${game.rawgId}`} >
                    {game.background_image && (
                    <img src={game.background_image} alt={game.title} className="game-image"/>)}
                    <h3>{game.title}</h3>
                </Link>

                <div className="game-field">
                  <label>Status</label>
                  <select value={game.status} onChange={(e) => handleUpdate(game._id, "status", e.target.value)}>
                    <option>À faire</option>
                    <option>En cours</option>
                    <option>Fini</option>
                  </select>
                </div>

                <div className="game-field">
                  <label>Note</label>
                  <input type="number" min="0" max="5" value={game.rating ?? ""}  onChange={(e) => handleRatingChange(game._id, e.target.value)}/>
                </div>

              <button className="delete-btn" onClick={(e) => {e.preventDefault(); handleDelete(game._id)}}>
                  Supprimer
                </button>
              </div>
            
          ))}
        </div>       
      )}
      <Footer />
    </>
  )
}

export default Library;
