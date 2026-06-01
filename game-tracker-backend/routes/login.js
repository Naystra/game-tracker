const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validateLogin } = require('../middleware/validateAuth');


// Route LOGIN :
router.post('/login', validateLogin, async (req, res) => {
    try {
        // Reçoit email et mot de passe du front
        const { email, password } = req.body;

        // Chercher user dans la BDD 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' })
        }

        // Vérifier le mot de passe
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Générer un token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '3d'
        });

        // Renvoyer le token et les infos de l'utilisateur au front
        res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email }
        });      

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur'});
    }
});


module.exports = router;