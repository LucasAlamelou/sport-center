const {
  coachCreate,
  coachUpdate,
  coachDelete,
  coachs,
} = require('../controllers/coach');
// Function qui défini chacune des routes
function coachRoute(app) {
  //Create
  app.post('/coachCreate', coachCreate);

  app.get('/coach', coachs);
  // Delete
  app.post('/coachDelete', coachDelete);

  // Update
  app.post('/coachUpdate', coachUpdate);
}

// Exporte les routes
module.exports = coachRoute;
