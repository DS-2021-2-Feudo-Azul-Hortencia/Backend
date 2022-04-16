const router = require('express').Router()
const Travel = require('../models/Travel')
const User = require('../models/User')


router.post('/planning', async (req, res) => {
    try {
      const travel = await Travel.create(req.body)
  
        res.json({ message: 'Viagem criada com sucesso!', travel })

    } catch (error) {
      res.status(500).json({ erro: error })
    }
})

router.get('/', async(req, res) => {
  try {
    const travels = await Travel.find({ user: req.query.id })

    res.status(200).json(travels)

} catch (error) {
    res.status(500).json({ erro: error })
}
})

router.get('/:id', async(req, res) => {
  const userId = req.params.id
  try {
    const travels = await Travel.find({ user: userId })

    res.status(200).json(travels)

} catch (error) {
    res.status(500).json({ erro: error })
}
})

router.delete('/:id', async(req, res) => {
  const id = req.params.id
  
  const travel = await Travel.findOne({ _id: id })
  
  if (!travel){
      res.status(422).json({message: 'Plano de viagem não encontrado.'})
      return
  }

  try {
      await Travel.deleteOne({ _id: id })

      res.status(200).json({message: 'Plano excluído.'})

  } catch (error) {
      res.status(500).json({ erro: error })
  }
})

router.get('/deleteAll', async(req, res) => {

  const travels = await Travel.find()

  try {
      await Travel.deleteMany({ travels })
      res.status(200).json({message: 'Todos as viagens foram deletadas.'})

  } catch (error) {
      res.status(500).json({ erro: error })
  }
})

module.exports = router
