const users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userController = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body
            const user = await users.findOne({ email })
            if (user) return res.status(400).json({ msg: "this email already exists" })

            if (password.length < 6)
                return res.status(400).json({ msg: "password must be at least 6 characters" })

            const passwordHash = await bcrypt.hash(password, 10)

            const newUser = new users({
                name, email, password: passwordHash
            })
            await newUser.save();
            const accessToken = createAccessToken({ id: newUser._id })
            const refreshToken = createRefreshToken({ id: newUser._id })
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })
            return res.json({ accessToken })

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await users.findOne({ email })
            if (!user) return res.status(400).json({ msg: "User does not exists" })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Incorrect Password" })
            const accessToken = createAccessToken({ id: user._id })
            const refreshToken = createRefreshToken({ id: user._id })
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })
            return res.json({ accessToken })

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    logoout: async (req, res) => {
        try {
            res.clearCookie('refreshToken', { path: '/user/refresh_token' })
            return res.json({ msg: "Logged Out" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    refreshToken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshToken;
            if (!rf_token) return res.status(400).json({ msg: "Please Login or Register" })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Login or register now" })
                const accessToken = createAccessToken({ id: user.id })
                return res.json({ accessToken })
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await users.findById(req.user.id)
            if (!user) return res.status(400).json({ msg: "User does not exists" })
            return res.json({ user })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

module.exports = userController