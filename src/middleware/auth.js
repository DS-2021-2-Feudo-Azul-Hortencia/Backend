const jwt = require('jsonwebtoken')

//função para checar o token
function checkToken(req, res, next ) {
    const authHeader = req.headers['authorization'] //tendo acesso ao token
    const token = authHeader && authHeader.split(" ")[1]  //pegando o array do token

//caso não venha um token
    if(!token){
    return res.status(401).json({msg:' Acesso Negado' })
    }
//validando se o token é correto
  try{
      const secret = process.env.SECRET
      jwt.verify(token,secret)

      req.user = jwt.decode(token)

      next()
  }catch(error){
      res.status(400).json({msg: 'Token inválido'})
  }

}

module.exports = { checkToken }