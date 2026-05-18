import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import "../styles/Profile.css";


function Profile() {
    const { user, setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [games, setGames] = useState([]);
    const [bio, setBio] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    

    const token = localStorage.getItem("token");

    // Fetch des jeux 
    useEffect(() => {
            if (!token) return;

            const fetchGames = async () => {
            try {
                const resGames = await axios.get(`${import.meta.env.VITE_API_URL}/api/games`, {headers: { Authorization: `Bearer ${token}`}});
                
                setGames(resGames.data);                            

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, [token]);
    


    // Initialiser la bio quand l'utilisateur la change
    useEffect(() => {
        if (user) setBio(user.bio || "");
    }, [user]);


    if (loading) return <p>Chargement...</p>;
    if (!user) return null;


    // Stats calculées côté frontend
    const totalGames = games.length;
    const finished = games.filter(g => g.status === "Fini").length;
    const ratedGames = games.filter(g => g.rating > 0);



    // Fonction pour changer la bio
    const handleSaveBio = async () => {
        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/me/bio`, 
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
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/upload-avatar`, formData,
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



    // Fonction pour modifier le mot de passe
    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            alert("Tous les champs sont obligatoires");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Les nouveaux mots de passe ne correspondent pas");
            return;
        }

        if (newPassword.length < 6) {
            alert("Le mot de passe doit faire au moins 6 caractères");
            return;
        }

        try {
            setPasswordLoading(true);

            await axios.put(`${import.meta.env.VITE_API_URL}/api/users/me/password`,
                { oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}`}}
            );

            alert("Mot de passe mis à jour avec succés !");

            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Erreur lors du chargement");
        } finally {
            setPasswordLoading(false);
        }
    };


    return (
        <>
            <Header />

            <div className="profile-header">
                <img src={user.avatar 
                ? `${import.meta.env.VITE_API_URL}/uploads/${user.avatar}` 
                : `https://ui-avatars.com/api/?name=${user.username}`} 
                alt="avatar" className="profile-avatar-large" />


                <div className="avatar-actions">
                    <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                    <button onClick={handleUpload}>Changer l'avatar</button>
                </div>


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
                    {totalGames >= 15 && <span className="badge">Collectionneur</span>}
                    {finished >= 10 && <span className="badge">Finisseur</span>}
                    {ratedGames.length >= 10 && <span className="badge">Critique</span>}
                </div>
            </div>


            <div className="profile-section password-section">
                <h2>Changer le mot de passe</h2>

                <div className="password-form">
                    <input type="password" placeholder="Ancien mot de passe" value={oldPassword} 
                    onChange={(e) => setOldPassword(e.target.value)} />

                    <input type="password" placeholder="Nouveau mot de passe" value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} />

                    <input type="password" placeholder="Confirmer le nouveau mot de passe" value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} />

                    <button className="change-password-btn" onClick={handleChangePassword} disabled={passwordLoading}>
                        {passwordLoading ? "Modification..." : "Modifier le mot de passe"}
                    </button>
                </div>
            </div>
 
            
        <Footer />                    
        </>
    );
}

export default Profile;