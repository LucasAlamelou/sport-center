async function subscriptions(req, res) {
  const Subscription = req.app.get('models').Subscription;
  const SubscriptionList = await Subscription.find();
  res.json(SubscriptionList);
}
async function subscriptionCreate(req, res) {
  try {
    if (req.role !== 'customer') {
      return res.json('Unauthorized');
    }
    const models = req.app.get('models');
    const customer = await models.Customer.find({ user: req.session.user });

    const newsubscription = await new models.Subscription({
      beginningDate: new Date(),
      endDate: req.body.endDate,
      paymendMethod: req.body.paymendMethod,
      amountPaid: req.body.amoundPaid,
      customer: customer._id,
    }).save();
    let theCustomer = await models.Customer.findById(customer[0]._id);

    theCustomer.subscriptions.push(newsubscription._id);
    await theCustomer.save();

    return res.json(newsubscription);
  } catch (error) {
    res.json(error.message);
  }
}

async function subscriptionDelete(req, res) {
  try {
    if (req.role !== 'manager') {
      return res.json('Unauthorized');
    }
    if (!req.body._id) {
      return res.json('Id manquant');
    }
    const models = req.app.get('models');
    const ToDeleteSubscription = await models.Subscription.findById(
      req.body._id
    );
    if (!ToDeleteSubscription) {
      return res.json('Subscription not found');
    }
    let theCustomer = await models.Customer.findById(
      ToDeleteSubscription.customer
    );
    let toDeleteIndex = theCustomer.subscriptions.indexOf(
      ToDeleteSubscription._id
    );

    theCustomer.subscriptions.splice(toDeleteIndex, 1);
    await theCustomer.save();
    await ToDeleteSubscription.remove();
    res.json('Sucessfully deleted');
  } catch (error) {
    res.json(error.message);
  }
}

async function subscriptionUpdate(req, res) {
  try {
    if (!req.body._id) {
      return res.json('id manquant !');
    }

    const subscription = req.app.get('models').Subscription;
    const ToModifySubscription = await subscription.findById(req.body._id);
    const toModifyKeys = Object.keys(req.body.toModify);
    for (const key of toModifyKeys) {
      ToModifySubscription[key] = req.body.toModify[key];
    }
    await ToModifySubscription.save();
    res.json(ToModifySubscription);
  } catch (error) {
    res.json(error.message);
  }
}

module.exports = {
  subscriptionCreate,
  subscriptionDelete,
  subscriptionUpdate,
  subscriptions,
};
