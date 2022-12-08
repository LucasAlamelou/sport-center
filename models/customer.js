const mongoose = require('mongoose');

// Crée l'object pour la bdd (colonne)
const CustomerSchema = new mongoose.Schema({
  subscriptions: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
  ],
  level: { type: String, default: 'beginner' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  slots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Slot' }],
});
const Customer = new mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
