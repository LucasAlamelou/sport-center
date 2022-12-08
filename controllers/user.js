const encryptPassword = require('../utils/encryptPassword');
const decryptPassword = require('../utils/decryptPassword');

async function userGetManager(req, res) {
  try {
    if (req.role !== 'manager') {
      res.response('Pas autoriser à cette page');
    }
    const role = req.session.role;
    const User = req.app.get('models').User;
    const Customer = req.app.get('models').Customer;
    const Coachs = req.app.get('models').Coach;
    const listUser = await User.find();
    const listCustomer = await Customer.find()
      .populate('user')
      .populate('subscriptions')
      .populate('level');
    const listCoach = await Coachs.find().populate('user');

    const session = req.session;
    if (session && session.authenticated && req.role === 'manager') {
      res.render('manager', { listUser, listCustomer, listCoach, role });
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    return error.message;
  }
}
async function userCreate(req, res) {
  try {
    if (!req.body.password) {
      return res.json('No password');
    }
    if (req.role !== 'manager') {
      return res.json('Unauthorized');
    }
    const { token, salt, hash } = encryptPassword(req.body.password);

    const User = req.app.get('models').User;
    const NewUser = await new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth,
      token,
      salt,
      hash,
    }).save();
    res.json(NewUser);
  } catch (error) {
    res.json(error.message);
  }
}

async function userDelete(req, res) {
  try {
    if (!req.body._id) {
      return res.send('Id manquant');
    }
    if (req.role !== 'manager') {
      return res.json('Unauthorized');
    }
    const User = req.app.get('models').User;
    const ToDeleteUser = await User.findById(req.body._id);
    if (!ToDeleteUser) {
      res.send('User not found');
    }
    await ToDeleteUser.remove();
    res.json('Sucessfully deleted User');
  } catch (error) {
    res.json(error.message);
  }
}

async function userUpdate(req, res) {
  try {
    const idUser = req.session.user;

    if (!idUser) {
      return res.json('id manquant ou champs manquant !');
    }
    /*if (req.role !== 'manager') {
      return res.json('Unauthorized');
    }*/
    const User = req.app.get('models').User;
    const ToModifyUser = await User.findById(idUser);
    const toModifyKeys = Object.keys(req.body);
    for (const key of toModifyKeys) {
      if (req.body[key] !== '') {
        ToModifyUser[key] = req.body[key];
      } else {
        ToModifyUser[key] = ToModifyUser[key];
      }
    }
    await ToModifyUser.save();
    res.json(ToModifyUser);
  } catch (error) {
    res.json(error.message);
  }
}

async function userLogin(req, res) {
  try {
    if (!req.body._id || !req.body.password) {
      return res.status(401).json('_id or password missing');
    }

    const User = req.app.get('models').User;
    try {
      const verifyUsername = await User.find({ username: req.body._id });
      const id = verifyUsername[0]._id;
      const toVerifyUser = await User.findById(id);
      const token = decryptPassword(toVerifyUser, req.body.password);
      if (
        decryptPassword(toVerifyUser, req.body.password) === 'Password invalid.'
      ) {
        return res.status(401).json('Mot de passe incorrect');
      }

      req.session.authenticated = true;
      req.session.user = id;
      req.session.token = toVerifyUser.token;
      req.session.role = toVerifyUser.role;

      if (toVerifyUser.role === 'customer') {
        return res.json('/customerHomePage');
      }
      if (toVerifyUser.role === 'manager') {
        return res.json('/usersManager');
      }
      if (toVerifyUser.role === 'coach') {
        return res.json('/coach');
      }
    } catch {
      return res.status(401).json('Utilisateur non trouvé');
    }
  } catch (error) {
    res.json(error.message);
  }
}

async function username(req, res) {
  const User = req.app.get('models').User;
  const verifyUsername = await User.find({ username: req.body.username });

  if (verifyUsername.length === 0) {
    return res.json('true');
  } else {
    return res.json('false');
  }
}

module.exports = {
  userGetManager,
  userCreate,
  userDelete,
  userUpdate,
  userLogin,
  username,
};
