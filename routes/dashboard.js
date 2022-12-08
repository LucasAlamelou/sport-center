function dashBoard(app) {
  app.get('/', function (req, res, next) {
    const session = req.session;
    if (session && session.authenticated) {
      res.render('index', {});
    } else {
      res.redirect('/login');
    }
    //res.render('index', {});
  });
}
module.exports = dashBoard;
