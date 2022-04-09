const mongoose = require('mongoose')

const File = mongoose.model('File', {
  fileName: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

module.exports = File;