const mongoose = require ('mongoose');

const gameSchema = new mongoose.Schema(
    {
        title: {type: String, required: true, trim: true},
        rawgId: {type: Number, required: true},
        status: {type: String, enum: ['À faire', 'En cours', 'Fini'], default: 'À faire'},
        rating: {type: Number, min: 0, max: 5},
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        background_image: {type: String}
    },
    { timestamps: true }
);

module.exports = mongoose.model('Game', gameSchema);