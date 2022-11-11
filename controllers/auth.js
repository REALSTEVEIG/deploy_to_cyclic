const Auth = require('../models/auth')
const jwt = require('jsonwebtoken')

exports.registerHTML = (req, res) => {
    return res.status(200).render('reg', {title : "Registration"})
}

exports.loginHTML = (req, res) => {
    return res.status(200).render('log', {title : "Login"})
}

exports.dashHTML = async (req, res) => {
    const token = req.cookies.token
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const username = payload.username.toUpperCase()
    return res.status(200).render('dash', {title : "Dashboard", msg :  username})
}

exports.pageNotFound = (req, res) => {
    return res.render('404')
}

exports.internalServerError = (req, res) => {
    return res.render('500')
}
exports.register = async (req, res) => {
    try {
        const {email, username, password} = req.body

        if (!username || !email || !password) {
            return res.status(400).render('reg', {msg : "Pleae provide all the required parameters"})
        }

        const user = await Auth.findOne({email})
        if (user) {
            return res.status(400).render('reg', {msg : "User already exists"})
        }

        const newUser = await Auth.create({...req.body})
        const token = newUser.createJWT()
        console.log(token)
        console.log(newUser)

        res.cookie('token', token, {secured : false, httpOnly : true})
        
        const nodemailer = require('nodemailer')

        const transporter = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                user : process.env.MY_EMAIL,
                pass : process.env.MY_PASSWORD
            }
        })

        const mailOptions = {
            from : 'AGU NIGERIA',
            to : req.body.email,
            subject : 'WELCOME',
            html : `<h1>Thank you for signing up to AGU NIGERIA</h1>`
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) throw err
            console.log('Sent' + info.response)
        })

        return res.status(201).redirect('log')
    } catch (error) {
        console.log(error)
        return res.status(500).render('reg', {msg : error.message})
    }
}

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body
        if (!email || !password) {
            return res.status(400).render('log', {msg : 'Please provide all the required parameters'})
        }

        const user = await Auth.findOne({email})

        if (!user) {
            return res.status(404).render('log', {msg : "User does not exist"})
        }

        const comparePasswords = await user.comparePasswords(password)

        if (!comparePasswords) {
            return res.status(400).render('log', {msg : "Wrong password!"})
        }

        console.log(user)
        const token = user.createJWT()

        res.cookie('token', token, {secured : false, httpOnly : true})
        console.log(req.cookies.token)
        return res.status(200).redirect('dash')

    } catch (error) {
        console.log(error)
        return res.status(500).render('log', {msg : error.message})
    }
}