const jwt = require ('jsonwebtoken');
const User = require ('../models/User');


// Création de middleware protect:
const protect = async (req, res, next) => {
    let token;

    // Vérifier si le token est présent dans l'en-tête
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        // Extraire le token
        token = req.headers.authorization.split(' ')[1]; // [1] prend uniquement le token

        // Sécurité 
        if (!token || token === 'null' || token ==='undefined') {
            return res.status(401).json({ message: "Token manquant ou mal formaté"});
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({ message: "utilisateur introuvable"});
            }

            next();
        } catch (err) {
            console.error("JWT ERROR:", err.message);
            return res.status(401).json({ message: "Token invalide" });
        }
    } else {
        return res.status(401).json({ message: "Aucun token fourni" });
    }
};

module.exports = protect;

    
        
