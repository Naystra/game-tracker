const express = require ('express');
const router = express.Router();
const Game = require('../models/Game');
const protect = require ('../middleware/auth');



router.get('/', protect, async (req, res) => {
    try {
        const userId = req.user._id;

        // Récupère tous les jeux de cet utilisateur
        const games = await Game.find({ user: userId });

        // Nombre total de jeux dans la collection de l'utilisateur
        const totalGames = games.length;

        // Compte les statut des jeux
        const finished = games.filter(g => g.status === 'Fini').length;
        const inProgress = games.filter(g => g.status === 'En cours').length;
        const toDo = games.filter(g => g.status === 'À faire').length;


       
        // Calcul la note moyenne des jeux
        const ratedGames = games.filter(g => g.rating);
        const averageRating = ratedGames.length > 0 ? (ratedGames.reduce((acc, game) => acc + game.rating, 0) / ratedGames.length).toFixed(1) : 0;

        res.json({ totalGames, finished, inProgress, toDo, averageRating });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreurs stats'})
    }
}) ;

module.exports = router;