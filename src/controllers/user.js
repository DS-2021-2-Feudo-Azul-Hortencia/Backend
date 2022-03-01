const User = require('../models/user');

const getUsers = async (req, res) => {
    const users = await User.find({});

    res.json({ data: users });
}

const createUser = async (req, res) => {
    const bodyUser = req.body;

    const userResp = new User({
        name: bodyUser.name,
        username: bodyUser.username,
        password: bodyUser.password,
    });

    const user = await userResp.save();

    res.json({ data: user });
}

module.exports = {
    getUsers,
    createUser
}