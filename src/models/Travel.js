const mongoose = require('mongoose')

const Travel = mongoose.model('Travel', {
  travelName: String,
  countries: Array,
  cities: Array,
  start: Date,
  end: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

module.exports = Travel;
