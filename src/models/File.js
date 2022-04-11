const mongoose = require('mongoose')

const File = mongoose.model('File', {
  userId: String,
  url: String
})

module.exports = File;

/*
try {
    const file = await File.create(req.body);
    
    const fileId = file._id;
    const userId = file.user;
    const user = await User.findOne({ _id: userId })

    try {
      res.json({ message: 'Viagem criada com sucesso!', travel })
    } catch (error) {
      res.status(400).json({ erro: `Não foi possível relacionar a viagem ${travel.travelName} ao usuário: ${userId}` })
    }*/