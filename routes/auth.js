const router = require('express').Router();
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const { userName, email, password } = req.body

    const emailExist = await User.findOne({ email: email })

    if (emailExist) return res.status(400).send({
        status: 400,
        message: 'Email already in use'
    })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({
        name: userName,
        email,
        password: hashedPassword
    })
    try {
        const savedUser = await user.save();
        const token = jwt.sign({_id: savedUser._id}, process.env.JWT_TOKEN_SECRET)

        res.send({
            status: 200,
            user: savedUser,
            token
        })
    } catch (error) {
        res.status(400).send(error);
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })

    if (!user) return res.send({
        status: 401,
        message: 'Email or password is incorrect'
    })

    const isValidPass = await bcrypt.compare(password, user.password)
    if(!isValidPass) return res.status(401).send({
        status: 401,
        message: 'Invalid Password!'
    })

    const token = jwt.sign({_id: user._id}, process.env.JWT_TOKEN_SECRET)
    res.header('auth-token', token).send({
        status:200,
        user,
        token
    })
})

module.exports = router;