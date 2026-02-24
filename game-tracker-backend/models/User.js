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

// Hash du MDP avant sauvegarde :
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare MDP :
userSchema.methods.matchPassword = function (password) {
    return bcrypt.compare(password, this.password);
};


module.exports = mongoose.model('User', userSchema);
