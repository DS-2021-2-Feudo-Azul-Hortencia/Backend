const mongoose = require('mongoose')


const Travel = mongoose.model('Travel', {
  travelName: String,
  country: String,
  city: String,
  start: Date,
  end: Date,
  
})

module.exports = Travel;