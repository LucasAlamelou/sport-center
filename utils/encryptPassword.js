// Install avec crypto-js pour encoder les password
const uid2 = require('uid2');
const SHA256 = require('crypto-js/sha256');
const encBase64 = require('crypto-js/enc-base64');

// Encrypte le mot de passe pour le mettre en base de données
function encryptPassword(password) {
  const token = uid2(16);
  const salt = uid2(16);
  const hash = SHA256(salt + password).toString(encBase64);
  return { token, salt, hash };
}

// Exporte la fonction
module.exports = encryptPassword;
