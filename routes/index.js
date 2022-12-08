/* GET base twig page. */

function router(app) {
  app.get('/', function (req, res, next) {
    res.render('home', {});
  });
}
module.exports = router;
