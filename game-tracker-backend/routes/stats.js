const express = require ('express');
const router = express.Router();
const Game = require('../models/Game');
const protect = require ('../middleware/auth');



router.get('/', protect, async (req, res) => {
    try {
        // Identifie l'utilisateur via son ID
        const userId = req.user._id;

        // Récupère tous les jeux de cet utilisateur
        const games = await Game.find({ user: userId });

        // Nombre total de jeux dans la collection de l'utilisateur
        const totalGames = games.length;

        // Compte les statuts des jeux
        const finished = games.filter(g => g.status === 'Fini').length;
        const inProgress = games.filter(g => g.status === 'En cours').length;
        const toDo = games.filter(g => g.status === 'À faire').length;


       
        // Calcule la note moyenne uniquement sur les jeux ayant une note (rating > 0), pour éviter que les jeux non notés faussent la moyenne
        const ratedGames = games.filter(g => g.rating > 0);
        const averageRating = ratedGames.length > 0 
        ? (ratedGames.reduce((acc, game) => acc + game.rating, 0) / ratedGames.length).toFixed(1) 
        : 0; // Retourne 0 si aucun jeu n'est noté 

        // Renvoyer un objet json au front avec les données
        res.json({ totalGames, finished, inProgress, toDo, averageRating });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreurs stats'})
    }
}) ;

module.exports = router;