const mongoose   = require('mongoose');
const noteSchema = require('./note').schema;
const bcrypt     = require('bcryptjs');

const userSchema = mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  notes: [noteSchema]
})

userSchema.statics.generateHash = (password)=> bcrypt.hashSync(password, 8)
userSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema)
