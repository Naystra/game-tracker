const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true, minlength: 6 },
        avatar: { type: String, default: "" }, 
        bio: { type: String, default: ""}    
    },
    {  timestamps: true }
);

// fonction qui s'exécute avant d'enregistrer un utilisateur : hash du mot de passe
userSchema.pre('save', async function () {
    // Si le password n'a pas été modifié, on ne fait rien
    if (!this.isModified('password')) return;

    // Générer un salt et hasher le password avant de l'enregistrer en BDD
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});



// Compare MDP :
userSchema.methods.matchPassword = function (password) {
    return bcrypt.compare(password, this.password);
};



module.exports = mongoose.model('User', userSchema);
