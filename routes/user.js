// Import des fonctions dans user controllers
const {
  userGetManager,
  userCreate,
  userDelete,
  userUpdate,
  userLogin,
  username,
} = require('../controllers/user');

// Function qui défini chacune des routes
function userRoute(app) {
  //Create
  app.post('/userCreate', userCreate);

  //read
  app.get('/usersManager', userGetManager);

  // Delete
  app.post('/userDelete', userDelete);

  // Update
  app.post('/userUpdate', userUpdate);

  //Login
  app.post('/userLogin', userLogin);

  //Username
  app.post('/username', username);
}

// Exporte les routes
module.exports = userRoute;
