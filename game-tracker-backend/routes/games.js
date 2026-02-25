const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const protect = require('../middleware/auth');
const { validateGame, validateUpdateGame } = require('../middleware/validateGame');


                                                            //// CRUD Games ////


// Créer un jeu (CREATE) :
router.post('/', protect, validateGame, async (req, res) => {
    try {
        const { title, rawgId, status, rating, background_image } = req.body;

        // Vérifier si le jeu existe déjà pour cet utilisateur
        const gameExists = await Game.findOne({
            rawgId,
            user: req.user._id
        });

        if (gameExists) {
            return res.status(400).json({
                message: "Ce jeu est déjà dans votre collection"
            });
        }

        // Créer le jeu et associe le jeu à l'utilisateur connecté grâce à req.user._id
        const game = await Game.create({
            title,
            rawgId,
            status,
            rating,
            background_image,
            user: req.user._id
        });
        res.status(201).json(game);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur création jeu' });
    }
});


// Voir ses jeux (READ) :
router.get('/', protect, async (req, res) => {
    try {
        const games = await Game.find({ user: req.user._id });
        res.json(games);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur récupération jeux '});
    }
});


// Modifier un jeu (UPDATE) :
router.put('/:id', protect, validateUpdateGame, async (req, res) => {
    try {
        const { title, status, rating } = req.body;

        // Trouver le jeu
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Jeu non trouvé '});
        }
        
        // Vérifier que l'utilisateur est propriétaire
        if (game.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Non autorisé' });
        }

        // Mettre à jour les champs
        if (title) game.title = title;
        if (status) game.status = status;
        if (rating) game.rating = rating;

        // Sauvergarde les modifications dans la BDD
        const updateGame = await game.save();

        res.json(updateGame);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur mise à jour du jeu' })
    }
});


// Supprimer un jeu (DELETE) :
router.delete('/:id', protect, async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Jeu non trouvé' });
        }

        // Vérifier que l'utilisateur est propriétaire
        if (game.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Non autorisé' });
        }

        // Suppression du jeu dans la BDD
        await game.deleteOne();
        
        res.json({ message: 'Jeu supprimé avec succès' })
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur suppression du jeu' })
    }
});



module.exports = router;