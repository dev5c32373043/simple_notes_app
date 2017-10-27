module.exports = (app)=>{
  const passport = require('passport');
  const User     = require('../models/user');

  passport.use(require('./strategies/local')(User))
  passport.serializeUser((user, cb)=> cb(null, user.id))
  passport.deserializeUser((id, cb)=>{
    User.findById(id, (error, user)=>{
      if(error){ return cb(error); }
      cb(null, user)
    })
  })
  app.use(passport.initialize())
  app.use(passport.session())

  require('./routes')(app, User, passport)
}
