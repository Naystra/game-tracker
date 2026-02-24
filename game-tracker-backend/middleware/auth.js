const jwt = require ('jsonwebtoken');
const User = require ('../models/User');


// Création de middleware protect:
const protect = async (req, res, next) => {

    // Variable vide pour stocker le token
    let token;  

    // Vérifier si le token est présent dans l'en-tête
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        // Extraire le token
        token = req.headers.authorization.split(' ')[1]; // [1] récupère uniquement le token

        // Sécurité 
        if (!token || token === 'null' || token === 'undefined') {
            return res.status(401).json({ message: "Token manquant ou mal formaté"});
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Vérification du token

            req.user = await User.findById(decoded.id).select("-password"); // Récupération de l'utilisateur en base en excluant le password

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

    
        
