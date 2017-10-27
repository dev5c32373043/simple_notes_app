const localStrategy = require('passport-local').Strategy;

module.exports = (User)=>{
  const strategy = new localStrategy({usernameField: 'nickname'}, (nickname, password, cb)=>{
    User.findOne({nickname: nickname}, (error, user)=>{
      if(error){ return cb(error); }
      if(!user){ return cb(null, false); }
      if(!user.comparePassword(password)){ return cb(null, false) }
      return cb(null, user);
    })
  })
  return strategy;
}
