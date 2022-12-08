async function login(req, res) {
  res.render('login', {});
}

async function register(req, res) {
  res.render('register', {});
}

module.exports = { login, register };
