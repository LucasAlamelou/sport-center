const { models } = require('mongoose');
const { Coach } = require('../models');

async function slots(req, res) {
  const role = req.session.role;
  const User = req.app.get('models').User;
  const Slot = req.app.get('models').Slot;
  let SlotList = await Slot.find().populate('coach');
  const Coach = [];
  SlotList.forEach(async (element, index) => {
    const CoachSlot = element.coach.user;
    const user = await User.findById(CoachSlot);
    Coach.push(user);
  });

  // Session gérer si l'utilisateur est connecté
  const session = req.session;
  if (session && session.authenticated) {
    res.render('slot', { SlotList, Coach, role });
  } else {
    res.render('login');
  }
}

async function slotCreate(req, res) {
  try {
    if (req.role !== 'coach') {
      return res.json('Unauthorized');
    }
    const models = req.app.get('models');
    const coach = await models.Coach.find({ user: req.session.user });
    // Create the slot
    const newSlot = await new models.Slot({
      date: req.body.date,
      startHour: req.body.startHour,
      endHour: req.body.endHour,
      label: req.body.label,
      peopleLimit: req.body.peopleLimit,
      coach: coach[0]._id,
      customer: [],
    }).save();
    let theCoach = await models.Coach.findById(coach[0]._id);

    theCoach.slot.push(newSlot._id);
    await theCoach.save();

    return res.redirect('/slots');
  } catch (error) {
    res.json(error.message);
  }
}

// Pour le customer
async function slotBook(req, res) {
  try {
    const idUser = req.session.user;
    if (req.session.role !== 'customer') {
      return res.json('Unauthorized');
    }
    const models = req.app.get('models');
    const theSlot = await models.Slot.findById(req.body.slot);
    if (theSlot.customer.lenght >= theSlot.peopleLimit) {
      return 'No spot left for this slot';
    }

    const theCustomerByUser = await models.Customer.find({
      user: idUser,
    }).populate('subscriptions');

    const theCustomer = await models.Customer.findById(
      theCustomerByUser[0]._id
    ).populate('subscriptions');
    let isSuscribed = false;
    for (const subscription of theCustomer.subscriptions) {
      if (
        subscription.beginningDate <= theSlot.date &&
        subscription.endDate >= theSlot.date
      ) {
        isSuscribed = true;
      }
    }
    if (isSuscribed) {
      theSlot.customer.push(theCustomer._id);
      await theSlot.save();
      theCustomer.slots.push(theSlot._id);
      await theCustomer.save();
      return res.redirect('/customerHomePage');
    } else {
      return res.send('No subscription for the slot date');
    }
  } catch (error) {
    res.json(error.message);
  }
}

async function slotDelete(req, res) {
  try {
    if (req.role !== 'coach') {
      return res.json('Unauthorized');
    }
    if (!req.body._id) {
      return res.json('Id manquant');
    }
    const models = req.app.get('models');
    const ToDeleteSlot = await models.Slot.findById(req.body._id);
    if (!ToDeleteSlot) {
      return res.json('Slot not found');
    }

    // Delete the slot in all customer
    for (const customer of ToDeleteSlot.customers) {
      let theCustomer = await models.Customer.findById(customer);
      let toDeleteIndex = theCustomer.slots.indexOf(ToDeleteSlot._id);
      theCustomer.slots.splice(toDeleteIndex, 1);
      await theCustomer.save();
    }

    // Delete the in the coach

    let theCoach = await models.Slot.Coach.findById(ToDeleteSlot.coach);
    let toDeleteIndex = theCoach.subscriptions.indexOf(ToDeleteSlot._id);
    theCoach.slot.splice(toDeleteIndex, 1);
    await theCoach.save();

    await ToDeleteSlot.remove();
    res.json('Sucessfully deleted');
  } catch (error) {
    res.json(error.message);
  }
}

async function slotUpdate(req, res) {
  try {
    const FormElement = req.body;
    const Form = new Object();
    Object.entries(FormElement).forEach(([key, value]) => {
      const valueKey = key;
      if (value !== '' || key !== '_id') {
        Form[valueKey] = value;
      }
    });
    if (req.role !== 'coach') {
      return res.json('Unauthorized');
    }
    if (!req.body._id) {
      return res.json('Id manquant');
    }
    const Slot = req.app.get('models').Slot;
    const ToModifySlot = await Slot.findById(req.body._id);
    if (!ToModifySlot) {
      return res.json('Slot not found');
    }
    const toModifyKeys = Object.keys(FormElement);
    for (const key of toModifyKeys) {
      if (FormElement[key] !== '') {
        ToModifySlot[key] = Form[key];
      } else {
        ToModifySlot[key] = ToModifySlot[key];
      }
    }
    await ToModifySlot.save();
    res.json(ToModifySlot);
  } catch (error) {
    res.json(error.message);
  }
}

module.exports = { slots, slotCreate, slotDelete, slotUpdate, slotBook };
