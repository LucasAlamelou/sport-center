// Avec une commande npm install
const express = require('express');
// Object mongoose pour une connection en a mongodb
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
// Les modèles
const models = require('./models');
var logger = require('morgan');
var path = require('path');
var Twig = require('twig'), // Twig module
  twig = Twig.twig; // Render function
const getRoleMiddleware = require('./utils/getRoleMiddleware');
// utilise le body parser
let bodyParser = require('body-parser');
var session = require('express-session');
const cookieParser = require('cookie-parser');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// MongoDb
const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_MDP;
const cluster = process.env.MONGO_CLUSTER;
const dbname = process.env.MONGO_DATABASE;

mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
  }
);
const db = mongoose.connection;
db.on('error', function () {
  console.log('echec connection');
});
db.once('open', function () {
  console.log('Connected to server successfully');
});
const app = express();
app.set('models', models);
app.use(
  session({
    name: 'session-sport-center',
    secret: 'cestsecretclepastouche',
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 2000 * 120 * 120 * 48 }, // 24 hours,
  })
);

const userRoute = require('./routes/user');
const customerRoute = require('./routes/customer');
const coachRoute = require('./routes/coach');
const subscriptionRoute = require('./routes/subscription');
const slotRoute = require('./routes/slot');
const dashBoard = require('./routes/index');
const loginRoute = require('./routes/login');
const { json } = require('body-parser');

app.set('twig options', {
  allow_async: true, // Allow asynchronous compiling
  strict_variables: false,
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
app.use(express.static('public'));

// Ecouter le form pour l'envoie de requete post
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger('dev'));
app.use(express.json());
app.use(getRoleMiddleware);
app.use(cookieParser());

userRoute(app);
customerRoute(app);
coachRoute(app);
subscriptionRoute(app);
slotRoute(app);
dashBoard(app);
loginRoute(app);

app.listen(port, () => {
  console.log('Server sucessfully launched');
});
/*client.connect((err) => {
  const collection = client.db('test').collection('devices');
  // perform actions on the collection object

  //mongoose.connect('mongodb://localhost/sportCenters');
  //mongoose.connect(uri);
  

  client.close();
});*/
