const {
  subscriptionCreate,
  subscriptionDelete,
  subscriptionUpdate,
  subscriptions,
} = require('../controllers/subscription');
// Function qui défini chacune des routes
function subscriptionRoute(app) {
  //Create
  app.post('/subscriptionCreate', subscriptionCreate);

  app.get('/subscriptions', subscriptions);
  // Delete
  app.post('/subscriptionDelete', subscriptionDelete);

  // Update
  app.post('/subscriptionUpdate', subscriptionUpdate);
}

// Exporte les routes
module.exports = subscriptionRoute;
