const express = require("express");
const User = require("../models/User");
const protect = require ('../middleware/auth');
const upload = require ("../config/multer.js");

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

module.exports = router;