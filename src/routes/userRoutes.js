const router = require('express').Router()
const req = require('express/lib/request')
const res = require('express/lib/response')

const User = require('../models/User')


//Create = Criação do dado

router.post('/registration', async (req, res) => {
    const { email } = req.body

    if (await User.findOne({ email }))
        return res.status(500).json({ error: 'E-mail já cadastrado' })

    const { password, passwordConfirm } = req.body
    //Confirmando senha
    if (password !== passwordConfirm)
        return res.status(500).json({ error: 'As senhas devem ser iguais' })
    try {
      const user = await User.create(req.body)
      
      //Fará com que o campo password não apareça quando for chamado  
      //user.password = undefined
  
      res.json({ message: 'Usuário inserido no sistema com sucesso!', user,
    })

    } catch (error) {
      res.status(500).json({ erro: error })
    }
  })

  //Read = leitura do dado

router.get('/', async(req, res) => {
    
    try {
        const users = await User.find()

        res.status(200).json(users)

    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.get('/:id', async (req, res) => {
    //extrair dado da requisição pela url = req.params
    const id = req.params.id

    try {
        const user = await User.findOne({ _id: id})
        
        if (!user){
            res.status(422).json({message: 'O usuário não foi encontrado.'})
            return
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

//Update = Atualização de dado (PUT, PATCH)
/*
router.patch('/:id', async(req, res) => {

    const id = req.params.id

    const user = req.body

    try {
        const updatedUser = await User.updateOne({ _id: id }, user)

        if (updatedUser.matchedCount === 0){

            res.status(422).json({message:'O usuário não foi encontrado.'})
            return
        }
        user.password = undefined
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})
*/

//Autenticação do Usuário

router.post('/authenticate', async(req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user)
        return res.status(500).json({ error: 'Usuário não foi encontrado'})

    if (password !== user.password)
        return res.status(500).json({ error: 'Senha inválida' })
    
    user.password = undefined //não mostrar a senha

    res.json({ user })
}) 

module.exports = router