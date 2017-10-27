const express      = require('express');
const mongoose     = require('mongoose');
const bodyParser   = require('body-parser');
const csrf         = require('csurf');
const cookieParser = require('cookie-parser');
const session      = require('express-session');
const redisStore   = require('connect-redis')(session);
const path         = require('path');
const morgan       = require('morgan');
const flash        = require('connect-flash');
const app          = express();
const config       = require('./config');

mongoose.Promise   = require('bluebird');

app.use(bodyParser.urlencoded({ extended: true }))

app.use(morgan('dev'))

app.set('view engine', 'jade')

app.use(express.static(path.join(__dirname, 'public')))

app.use(cookieParser())

app.use(session({
  store: new redisStore(),
  secret: config.sessionSecretKey,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 15 }
}))

app.use(csrf({
  ignoreMethods: ['GET']
}))

app.use(flash())

mongoose.connect(config.db)
const database = mongoose.connection
database.on('error', console.error.bind(console, 'connection error:'))
database.once('open', ()=>{
  require('./app/auth/root')(app);
  require('./app/notes/root')(app);
  require('./app/tasks/root')(app);
  app.listen(3000, ()=> console.log('Express listening on port 3000!'))
})
