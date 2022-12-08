const mongoose = require('mongoose');

// Crée l'object pour la bdd (colonne)
const SlotsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startHour: { type: String, required: true },
  endHour: { type: String, required: true },
  label: { type: String, required: true },
  peopleLimit: { type: Number, default: 1 },
  coach: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach' },
  customer: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
});
const Slot = new mongoose.model('Slot', SlotsSchema);

module.exports = Slot;
//mongoose.Schema.Types.ObjectId, ref: 'Customer'
