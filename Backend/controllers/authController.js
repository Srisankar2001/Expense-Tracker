const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const secret_key = process.env.SECRET_KEY

const register = async(req,res) => {
    const { name, email, password} = req.body

    if(!name || !email || !password){
        return res.status(400).json({success : false, message : "Input nessary details"})
    }

    try{
        const existingUser = await userModel.findOne({email})

        if(existingUser){
            return res.status(400).json({success : false, message : "Email already registered"})
        }

        const hash = await bcrypt.hash(password,10)

        if(!hash){
            return res.status(400).json({success : false, message : "Internal Server Error"})
        }

       const newUser = new userModel({ name,email,password:hash })

       const savedUser = await newUser.save()

       if(!savedUser){
        return res.status(400).json({success : false, message : "Can't register the user"})
       }

       return res.status(200).json({success : true, message : "User registerd successfully"})

    }catch(error){
        return res.status(400).json({success : false, message : "Internal Server Error"})
    }
}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Input nessary details" })
    }

    try {
        const existingUser = await userModel.findOne({ email })

        if (!existingUser) {
            return res.status(400).json({ success: false, message: "Email not registered" })
        }

        const match = await bcrypt.compare(password, existingUser.password)

        if (!match) {
            return res.status(400).json({ success: false, message: "Passsword is wrong" })
        }

        const payload = {
            _id: existingUser._id
        }
        const token = jwt.sign(payload, secret_key, { expiresIn: '1d' })

        if (!token) {
            return res.status(500).json({ success: false, message: "Internal Server Error. Can't Generate The Token" })
        }

        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        return res.status(200).json({ success: true, message: "Login Successfull", token })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error." })
    }
}

const verify = async (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(400).json({ success: false, message: "Session Expired. Login Again." })
    }

    try {
        const verify = jwt.verify(token, secret_key)

        if (!verify) {
            res.clearCookie('token', { httpOnly: true })
            return res.status(400).json({ success: false, message: "Invalid Token. Login again." })
        }

        next()
    } catch (error) {
        res.clearCookie('token', { httpOnly: true })
        return res.status(400).json({ success: false, message: "Invalid Token. Login again." })
    }
}

const details = async (req, res) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(400).json({ success: false, message: "Session Expired. Login Again." })
    }

    try {
        const decode = jwt.verify(token, secret_key)

        if (!decode) {
            res.clearCookie('token', { httpOnly: true })
            return res.status(400).json({ success: false, message: "Invalid Token. Login again." })
        }
        return res.status(200).json({ success: true, data: decode })
    } catch (error) {
        res.clearCookie('token', { httpOnly: true })
        return res.status(400).json({ success: false, message: "Invalid Token. Login again." })
    }
}

const logout = async (req, res) => {
    res.clearCookie('token', { httpOnly: true })
    return res.status(200).json({ success: true, message: "Logout Successfully." })
}

const authController = {
    register,
    login,
    verify,
    details,
    logout
}

module.exports = authController