import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import "../Styles/Profile.css";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [games, setGames] = useState([]);
    const [bio, setBio] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    

    const token = localStorage.getItem("token");


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Récupérer le user connecté
                const res = await axios.get("http://localhost:5000/api/users/me", {headers: {Authorization: `Bearer ${token}`}});

                setUser(res.data);
                setBio(res.data.bio || "");


                // Récupérer les jeux
                const gamesRes = await axios.get("http://localhost:5000/api/games", {headers: { Authorization: `Bearer ${token}`}});

                setGames(gamesRes.data);


            } catch (err) {
                console.error(err);
                alert("Erreur chargement profil");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);


    if (loading) return <p>Chargement...</p>;
    if (!user) return <p>Utilisateur introuvable</p>


    // Stats calculées côté frontend
    const totalGames = games.length;
    const finished = games.filter(g => g.status === "Fini").length;
    const ratedGames = games.filter(g => g.rating > 0);



    // Fonction pour changer la bio
    const handleSaveBio = async () => {
        try {
            const res = await axios.put("http://localhost:5000/api/users/me/bio", 
                { bio }, { headers: { Authorization: `Bearer ${token}`}}
            );
            setUser(res.data);
            alert("Bio mise à jour !")
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la mise à jour de la bio")
        }
    };



    // Fonction pour upload des images
    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("avatar", selectedFile);

        try {
            const res = await axios.post("http://localhost:5000/api/users/upload-avatar", formData,
                { headers: {"Content-Type": "multipart/form-data", Authorization: `Bearer ${token}`}}
            );

            setUser(res.data);
            setSelectedFile(null);

            alert("Avatar mis à jour !")
        } catch (err) {
            console.error(err);
            alert("Erreur upload avatar")
        }
    };


    return (
        <>
            <Header />

            <div className="profile-header">
                <img src={user?.avatar ? `http://localhost:5000/uploads/${user.avatar}` : `https://ui-avatars.com/api/?name=${user?.username}`} 
                alt="avatar" className="profile-avatar-large" />

                <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                <button onClick={handleUpload}>Changer l'avatar</button>

                <div className="profile-info">
                    <div className="profile-quick-stats">
                        <span>🎮 {totalGames} jeux</span>
                        <span>✅ {finished} finis</span>
                        <span>⭐ {ratedGames.length} notés</span>
                    </div>

                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Écris ta bio ici..." 
                    rows={4} className="bio-textarea" />

                    <button className="save-bio-btn" onClick={handleSaveBio}>Enregistrer la bio</button>

                    <div className="social-links">
                        <a href="https://www.twitter.com/" target="_blank">Twitter</a>
                        <a href="https://www.instagram.com/" target="_blank">Instagram</a>
                    </div>
                </div>
            </div>




            <div className="profile-section">
                <h2>Jeux le mieux notés</h2>
                <div className="top-games">
                    {[...games]
                        .sort((a, b) => b.rating - a.rating)
                        .slice(0, 3)
                        .map((game) => (
                            <div key={game._id} className="top-game">
                                <img src={game.background_image} alt={game.title} />
                                <p>{game.title} - {game.rating}</p>
                            </div>
                        ))}
                </div>

                        

                <h2> Jeux le moins bien notés</h2>
                <div className="low-games">
                    {[...games]
                        .sort((a, b) => a.rating - b.rating)
                        .slice(0, 3)
                        .map((game) => (
                            <div key={game._id} className="low-game">
                                <img src={game.background_image} alt={game.title} />
                                <p>{game.title} - {game.rating}</p>
                            </div>
                        ))}    
                </div>
            </div>



            <div className="profile-section">
                <h2>Activité récente</h2>
                <ul>
                    {games.slice(-5).map((game) => (
                        <li key={game._id}>
                            {game.title} — {game.status} —  Note: {game.rating || "N/A"}
                        </li>
                    ))}
                </ul>
            </div>



            <div className="profile-section">
                <h2>Badges</h2>
                <div className="badges">
                    {totalGames >= 30 && <span className="badge">Collectionneur</span>}
                    {finished >= 10 && <span className="badge">Finisseur</span>}
                    {ratedGames.length >= 10 && <span className="badge">Critique</span>}
                </div>
            </div>




        <div className="profile-section">
            <h2>Favoris</h2>
            <div className="favorites">
                {games
                    .filter(g => g.isFavorite)
                    .slice(0, 5)
                    .map((game => (
                        <div key={game._id} className="favorite-game">
                            <img src={game.background_image} alt={game.title} />
                            <p>{game.title}</p>
                        </div>
                    )))}
                {games.filter(g => g.isFavorite).length === 0 && <p>Aucun favoris pour le moment.</p>}
            </div>
        </div>




            
        <Footer />                    
        </>
    );
}

export default Profile;