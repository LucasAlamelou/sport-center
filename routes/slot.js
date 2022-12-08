const {
  slots,
  slotCreate,
  slotBook,
  slotDelete,
  slotUpdate,
} = require('../controllers/slot');

// Function qui défini chacune des routes
function slotRoute(app) {
  //Create
  app.post('/slotCreate', slotCreate);

  // S'incrire a un slot
  app.post('/slotBook', slotBook);

  app.get('/slots', slots);
  // Delete
  app.post('/slotDelete', slotDelete);

  // Update
  app.post('/slotUpdate', slotUpdate);
}

// Exporte les routes
module.exports = slotRoute;
