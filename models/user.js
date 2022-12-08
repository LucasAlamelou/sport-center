const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
// Crée l'object pour la bdd (colonne)
const UserSchema = new mongoose.Schema({
  username: { type: String, require: true, unique: true },
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  email: { type: String, require: true },
  token: { type: String, require: true },
  salt: { type: String, require: true },
  hash: { type: String, require: true },
  dateOfBirth: { type: Date, require: true },
  role: { type: String, default: 'customer' },
});
UserSchema.plugin(uniqueValidator, {
  message: "Error, l'username {VALUE} est déjà utilsée.",
});
const User = new mongoose.model('User', UserSchema);

module.exports = User;
