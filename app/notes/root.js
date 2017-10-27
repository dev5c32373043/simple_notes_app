const User = require('../models/user');

module.exports = (app)=> require('./routes')(app, User);
