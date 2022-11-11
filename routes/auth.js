const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')

const {register, login, dashHTML, loginHTML, registerHTML, pageNotFound, internalServerError} = require('../controllers/auth')

router.route('/register').post(register)
router.route('/login').post(login)

router.route('/dash').get(authMiddleware, dashHTML)
router.route('/reg').get(registerHTML)
router.route('/log').get(loginHTML)

router.route('/404').get(pageNotFound)
router.route('/500').get(internalServerError)

module.exports = router