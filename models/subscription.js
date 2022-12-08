const mongoose = require('mongoose');

// Crée l'object pour la bdd (colonne)
const SubscriptionSchema = new mongoose.Schema({
  beginningDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  paymendMethod: { type: 'string', required: true },
  amountPaid: { type: Number, default: 1 },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
});
const Subscription = new mongoose.model('Subscription', SubscriptionSchema);

module.exports = Subscription;
