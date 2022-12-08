const encryptPassword = require('../utils/encryptPassword');
const userGet = require('../controllers/user').default;

async function customerHomePage(req, res) {
  const session = req.session;
  const role = req.session.role;
  if (session && session.authenticated) {
    if (role === 'manager' || role === 'customer') {
      const Customer = req.app.get('models').Customer;
      const Slot = req.app.get('models').Slot;
      const userConnected = req.session.user;
      const CustomerInfo = await Customer.find({ user: userConnected })
        .populate('user')
        .populate('subscriptions')
        .populate('level');

      const idCustomer = CustomerInfo[0]._id;
      const CustomerInfoSubscription = await Customer.findById(idCustomer)
        .populate('subscriptions')
        .populate('slots');

      res.render('index', {
        CustomerInfoSubscription,
        CustomerInfo,
        role,
      });
    } else {
      res.json('no acces');
    }
  } else {
    res.redirect('/login');
  }
}
async function customer(req, res) {
  const session = req.session;
  const role = req.session.role;
  if (session && session.authenticated) {
    const Customer = req.app.get('models').Customer;
    const userConnected = req.session.user;
    const CustomerInfo = await Customer.find({ user: userConnected })
      .populate('user')
      .populate('subscriptions')
      .populate('level');

    const idCustomer = CustomerInfo[0]._id;

    const CustomerInfoSubscription = await Customer.findById(
      idCustomer
    ).populate('subscriptions');

    res.render('profile', {
      CustomerInfo: CustomerInfo,
      CustomerInfoSubscription: CustomerInfoSubscription,
      role,
    });
  } else {
    res.redirect('/login');
  }
}

async function customerCreate(req, res) {
  try {
    if (!req.body.password) {
      return res.json('No password');
    }
    /*if (req.role !== 'manager') {
      return res.json('Unauthorized');
    }*/

    const models = req.app.get('models');
    const { token, salt, hash } = encryptPassword(req.body.password);

    const NewUser = await new models.User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth,
      token,
      salt,
      hash,
    }).save();

    const newCustomer = await new models.Customer({ user: NewUser._id }).save();
    return res.render('profile', newCustomer);
  } catch (error) {
    res.json(error.message);
  }
}

async function customerDelete(req, res) {
  try {
    if (req.role !== 'manager') {
      return res.json('Unauthorized');
    }
    if (!req.body._id) {
      return res.json('Id manquant');
    }
    const Customer = req.app.get('models');
    const ToDeleteCustomer = await Customer.Customer.findById(req.body._id);
    if (!ToDeleteCustomer) {
      return res.json('Customer not found');
    }
    let toDeleteUser = await Customer.User.findById(ToDeleteCustomer.user);
    await toDeleteUser.remove();
    await ToDeleteCustomer.remove();
    res.json('Sucessfully deleted User');
  } catch (error) {
    res.json(error.message);
  }
}

async function customerUpdate(req, res) {
  try {
    if (!req.body._id) {
      return res.json('id manquant !');
    }
    if (req.role !== 'manager') {
      return res.json('Unauthorized');
    }

    const Customer = req.app.get('models').Customer;
    const ToModifyCustomer = await Customer.findById(req.body._id);
    const toModifyKeys = Object.keys(req.body.toModify);
    for (const key of toModifyKeys) {
      ToModifyCustomer[key] = req.body.toModify[key];
    }
    await ToModifyCustomer.save();
    res.json(ToModifyCustomer);
  } catch (error) {
    res.json(error.message);
  }
}

module.exports = {
  customer,
  customerHomePage,
  customerCreate,
  customerDelete,
  customerUpdate,
};
