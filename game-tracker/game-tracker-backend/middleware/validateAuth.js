const { body, validationResult } = require('express-validator');


// Middleware pour afficher les erreurs
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};


// Validation Register
const validateRegister = [
    body('username')
        .trim()
        .notEmpty().withMessage("Le nom d'utilisateur est obligatoire")
        .isLength({ min: 3 }).withMessage("Le nom d'utilisateur doit faire minimum 3 caractères"),

    body('email')
        .notEmpty().withMessage("L'email est obligatoire")
        .isEmail().withMessage("Email invalide")
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage("Le mot de passe est obligatoire")
        .isLength({ min: 6 }).withMessage("Le mot de passe doit faire minimum 6 caractères"),

    handleValidationErrors
];


// Validation Login
const validateLogin = [
    body('email')
        .notEmpty().withMessage("L'email est obligatoire")
        .isEmail().withMessage("Email invalide"),

    body('password')
        .notEmpty().withMessage("Le mot de passe est obligatoire"),

    handleValidationErrors   
       
];

module.exports = { validateRegister, validateLogin };