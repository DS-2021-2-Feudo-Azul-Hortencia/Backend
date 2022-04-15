const router = require('express').Router()

const User = require('../models/User')

const jwt = require('jsonwebtoken');

const {checkToken} = require('../middleware/auth')


//Create = Criação do dado

router.post('/registration', async (req, res) => {
    const { email, name, password, passwordConfirm } = req.body

    if(!name){
        return res.status(422).json({ error: 'o nome é obrigatório'})
    }

    if(!password){
        return res.status(422).json({ error: 'a senha é obrigatória'})
    }
    if(!email){
        return res.status(422).json({ error: 'o email é obrigatório'})
    }

    if (await User.findOne({ email }))
        return res.status(500).json({ error: 'E-mail já cadastrado' })

    if (password !== passwordConfirm)
        return res.status(500).json({ error: 'As senhas devem ser iguais' })
    try {
      const user = await User.create(req.body)
       
    const secret = process.env.SECRET
        const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email
        },
            secret,
        )


      //Fará com que o campo password não apareça quando for chamado  
      //user.password = undefined
  
      res.json({ message: 'Usuário inserido no sistema com sucesso!', token})

    } catch (error) {
      console.log(error)

      res.status(500).json({
          msg: 'aconteceu um erro no servidor , tente mais tarde!'
     })
    }
  })




  //Read = leitura do dado

router.get('/', async(req, res) => {
    
    try {

        const users = await User.find()


        res.status(200).json({msg: 'autenticação foi realizada com sucesso',token})

    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.get('/:id', checkToken, async (req, res) => {
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

//Autenticação do Usuário

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body

    if(!email){
        return res.status(422).json({ error: 'o email é obrigatório'})
    }

    if(!password){
        return res.status(422).json({ error: 'a senha é obrigatória'})
    }

    const user = await User.findOne({ email })

    if (!user)
        return res.status(500).json({ error: 'Usuário não foi encontrado'})

    if (password !== user.password)
        return res.status(500).json({ error: 'Senha inválida' })

    try {

        const secret = process.env.SECRET
        const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email
        },
            secret,
        )

        res.status(200).json({msg: 'autenticação foi realizada com sucesso', token})

    } catch (error) {
        res.status(500).json({ erro: error })
    }   
}) 

//Update = Atualização de dado (PUT, PATCH)

router.patch('/changePassword', async(req, res) => {

    const { email, oldPassword, newPassword, confirmPassword } = req.body
    const user = await User.findOne({ email })

    if (oldPassword !== confirmPassword)
        return res.status(500).json({ message: "Verifique se as senhas são iguais nos 2 campos" })

    if (oldPassword !== user.password)
        return res.status(500).json({ message: "Senha incorreta" })

    try {
        await User.updateOne({ email }, {password: newPassword} )
   
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})


module.exports = router
