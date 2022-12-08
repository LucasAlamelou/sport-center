const { login, register } = require('../controllers/login');
const express = require('express');
// Function qui défini chacune des routes
function loginRoute(app) {
  app.get('/login', login);

  app.get('/logout', (req, res) => {
    res.cookie('token', '');
    req.session.destroy((err) => {
      if (err) {
        return console.log(err);
      }
      res.redirect('/login');
    });
  });

  app.get('/register', register);
}

// Exporte les routes
module.exports = loginRoute;
