const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const routes = require('./routes')
require('./config/db');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({origin: '*'}));

app.use(routes)

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
