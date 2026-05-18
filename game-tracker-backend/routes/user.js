const express = require("express");
const User = require("../models/User");
const protect = require ('../middleware/auth');
const upload = require ("../config/multer.js");
const bcrypt = require("bcrypt");

const router = express.Router();


// Récupérer le profil de l'utilisateur
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password"); // .select("-password") On enlève le mot de passe pour sécurité

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


// Upload des images
router.post('/upload-avatar', protect, upload.single("avatar"), async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByIdAndUpdate(userId, { avatar: req.file.filename }, { new: true });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Upload echoué" });
    }
});




// Modifier le BIO d'un user
router.put('/me/bio', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: "Utilisateur introuvable"});

        user.bio = req.body.bio || user.bio;
        await user.save();

        res.json(user);       
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur"});
    } 
});



// Changer le mot de passe
router.put('/me/password', protect, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // Récupérer l'utilisateur depuis le token
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "Utilisateur introuvable"});

        // Vérifier que l'ancien mot de passe est correct
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Ancien mot de passe incorrect"});

        
        user.password = newPassword;
        await user.save();


        res.json({ message: "Mot de passe mis à jour !" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur"});
    }
});


module.exports = router;