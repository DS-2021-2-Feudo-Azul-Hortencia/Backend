const mongoose = require('mongoose')


const User = mongoose.model('Travel', {
  travelName: String,
  country: String,
  city: String,
  start: Date,
  end: Date,
  
})

module.exports = Travel;