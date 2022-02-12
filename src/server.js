const express = require('express');

const PORT = 3000;
const app = express();

app.get("/", (req, res) => {
    res.json({ hello: 'world'});
});

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});