const SHA256 = require('crypto-js/sha256');
const encBase64 = require('crypto-js/enc-base64');

// Décypte le mot de passe afin de vérifier la connexion
function decryptPassword({ salt, hash, token }, password) {
  const toCompareHash = SHA256(salt + password).toString(encBase64);

  if (hash === toCompareHash) {
    return { token };
  }
  return 'Password invalid.';
}

module.exports = decryptPassword;
