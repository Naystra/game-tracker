const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Charge les variables du fichier .env
dotenv.config();

// Création de l'application Express
const app = express();

// Active CORS pour toute les routes
app.use(cors());

// Middleware qui permet de lire le JSON dans req.body
app.use(express.json());


// Route Test :
app.get('/', (req, res) => {
    res.send('API Game Tracker OK'); 
});


// Routes :
app.use('/api/auth', require('./routes/auth'));
app.use('/api/auth', require('./routes/login'));
app.use('/api/games', require('./routes/games'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/users', require('./routes/user'));

// Rendre le dossier uploads accessible
app.use('/uploads', express.static('uploads'));



// Connexion MongoDB + lancement du serveur :
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
})
.then(() => {
    console.log('MongoDB connecté');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Serveur lancé sur : http://localhost:${PORT}`);
    });
})
    .catch(err =>  {
        console.error('Erreur MongoDB :', err);
    });






