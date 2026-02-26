const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}


const validateGame = [
    body('title')
        .notEmpty().withMessage("Le titre est  obligatoire"),

    body('rawgId')
        .notEmpty().withMessage("rawgId est obligatoire")
        .isNumeric().withMessage("rawgId doit être un nombre"),

    body('status')
        .optional()
        .isIn(['À faire', 'En cours', 'Fini']).withMessage("Status invalide"),

    body('rating')
        .optional()
        .isFloat({ min: 0, max: 5 }).withMessage("La note doit être entre 0 et 5"),


    handleValidationErrors
    ];


    const validateUpdateGame = [
        body('status')
            .optional()
            .isIn(['À faire', 'En cours', 'Fini']).withMessage("Status invalide"),

        body('rating')
            .optional()
            .isFloat({ min: 0, max: 5 }).withMessage("La note doit être entre 0 et 5"),

        
        handleValidationErrors
    ];

    module.exports = { validateGame, validateUpdateGame };