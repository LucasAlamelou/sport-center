const {
  customer,
  customerHomePage,
  customerCreate,
  customerDelete,
  customerUpdate,
} = require('../controllers/customer');

// Function qui défini chacune des routes
function customerRoute(app) {
  //Create
  app.post('/customerCreate', customerCreate);

  app.get('/customer', customer);

  // Get
  app.get('/customerHomePage', customerHomePage);

  // Delete
  app.post('/customerDelete', customerDelete);

  // Update
  app.post('/customerUpdate', customerUpdate);
}
// Exporte les routes
module.exports = customerRoute;
