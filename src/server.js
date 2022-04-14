const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3003;
const app = express();
const cors = require("cors");

require('dotenv').config()

app.use(cors());

// forma de ler JSON
app.use(
    express.urlencoded({
        extended: false,
    }),
)

app.use(express.json())

app.get("/", (req, res) => {
    res.json({ message:'Teste'})
});

//outras rotas

const userRoutes = require('./routes/userRoutes')
    //quando a URL tiver "/user", sera executado aquilo que estiver em userRoutes,
    //ou seja, o que estiver no arquivo localizado em './routes/userRoutes'
app.use('/user', userRoutes)

const travelRoutes = require('./routes/travelRoutes')
app.use('/travel', travelRoutes)

const fileRoutes = require('./routes/fileRoutes')
app.use('/file', fileRoutes)

 //entrega uma porta
 app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});

const USER = process.env.DB_USER
const PASSWORD = process.env.DB_PASSWORD

mongoose.connect(
    `mongodb+srv://${USER}:${PASSWORD}@cluster0.asirv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    )   
    //caso dê certo:
    .then(() => {
        console.log('Conectado ao MongoDB!')
    })
    //caso contrário:
    .catch((err) => (console.log(err)))

