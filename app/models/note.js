const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Finished'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const noteSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  tasks: [taskSchema]
})

module.exports = {schema: noteSchema,  model: mongoose.model('Note', noteSchema)}
