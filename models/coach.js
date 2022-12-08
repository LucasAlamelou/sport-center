const mongoose = require('mongoose');

// Crée l'object pour la bdd (colonne)
const CoachSchema = new mongoose.Schema({
  discipline: { type: String, default: 'multisport' },
  bio: { type: String, default: 'No bio for this coach' },
  slot: { type: Array, default: [] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
const Coach = new mongoose.model('Coach', CoachSchema);

module.exports = Coach;
