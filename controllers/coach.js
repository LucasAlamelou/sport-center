const encryptPassword = require('../utils/encryptPassword');
const { models } = require('mongoose');

async function coachs(req, res) {
  if (req.session.authenticated === true) {
    const Coach = req.app.get('models').Coach;
    const Slot = req.app.get('models').Slot;
    const role = req.session.role;
    const idUser = req.session.user;
    let CoachList;
    if (req.query.discipline) {
      CoachList = await Coach.find({
        discipline: req.query.discipline,
      }).populate('user');
    } else {
      // Populate avec la table user
      CoachList = await Coach.find({}, 'bio').populate(
        'user',
        'lastName firstName'
      );
    }
    const CustomerInfo = await Coach.find({ user: idUser })
      .populate('user')
      .populate('slot');
    const SlotList = [];
    if (CustomerInfo !== null) {
      const SlotCoach = CustomerInfo[0].slot;

      for (const element of SlotCoach) {
        SlotList.push(await Slot.find(element));
      }
    }
    const session = req.session;
    if (session && session.authenticated) {
      req.session.coachId = CustomerInfo[0]._id;
      res.render('profile', { CustomerInfo, role, SlotList });
    }
  } else {
    res.redirect('/login');
  }
}
async function coachCreate(req, res) {
  try {
    const role = req.session.role;
    if (!req.body.password) {
      return res.json('No password');
    }
    /*if (req.role !== 'manager') {
      return res.json('Unauthorized');
    }*/
    const { token, salt, hash } = encryptPassword(req.body.password);
    const models = req.app.get('models');
    const NewUser = await new models.User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth,
      email: req.body.email,
      token,
      salt,
      hash,
      role: 'coach',
    }).save();
    const CustomerInfo = await new models.Coach({ user: NewUser._id }).save();
    return res.render('profile', { CustomerInfo, role });
  } catch (error) {
    res.json(error.message);
  }
}

async function coachDelete(req, res) {
  try {
    if (req.role !== 'manager') {
      return res.json('Unauthorized');
    }
    if (!req.body._id) {
      return res.send('Id manquant');
    }

    const Coach = req.app.get('models');
    const ToDeleteCoach = await Coach.Coach.findById(req.body._id);
    if (!ToDeleteCoach) {
      return res.send('Coach not found');
    }

    let toDeleteUser = await Coach.User.findById(ToDeleteCoach.user);
    await toDeleteUser.remove();
    await ToDeleteCoach.remove();
    res.json('Sucessfully deleted User');
  } catch (error) {
    res.json(error.message);
  }
}

async function coachUpdate(req, res) {
  try {
    if (req.role !== 'coach') {
      return res.json("Vous n'est pas autorisé.");
    }
    const Coach = req.app.get('models').Coach;
    const ToModifyCoach = await Coach.findById(req.session.coachId);
    const toModifyKeys = Object.keys(req.body);
    for (const key of toModifyKeys) {
      if (req.body[key] !== '') {
        ToModifyCoach[key] = req.body[key];
      } else {
        ToModifyCoach[key] = ToModifyCoach[key];
      }
    }
    try {
      await ToModifyCoach.save();
      return res.json(true);
    } catch (error) {
      return res.json(false);
    }
  } catch (error) {
    res.json(error.message);
  }
}

module.exports = {
  coachs,
  coachCreate,
  coachDelete,
  coachUpdate,
};
