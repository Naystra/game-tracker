const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');



// Route REGISTER :
router.post('/register', async (req, res) => {
    try {
        // Récupérer les données du front
        const { username, email, password } = req.body;

        // Verifier si l'utilisateur existe deja
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email déjà utilisé' });
        }

        // Créer le nouvel utilisateur
        const user = new User({ username, email, password });
        await user.save();

        // Générer un token JWT 
        const token = jwt.sign({ id : user._id}, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        // Renvoyer le token et les infos de l'utilisateur
        res.status(201).json({
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });

        } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


module.exports = router;