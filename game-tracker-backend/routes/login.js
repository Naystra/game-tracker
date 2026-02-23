const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');


// Route LOGIN :
router.post('/login', async (req, res) => {
    try {
        // Recupérer email et mot de passe
        const { email, password } = req.body;

        // Chercher user dans MongoDB
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
            expiresIn: '7d'
        });

        // Renvoyer token et infos user
        res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email }
        });      

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur'});
    }
});


module.exports = router;