const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authSchema = new mongoose.Schema({
    email : {
        type : String
    },
    username : {
        type : String
    },
    password : {
        type : String
    }
})

authSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
})

authSchema.methods.getname = function () {
    return this.username
}
 authSchema.methods.createJWT = function () {
     return jwt.sign(
         {id : this._id, username : this.username, email : this.email}, 
         process.env.JWT_SECRET, 
         {expiresIn : process.env.JWT_LIFETIME})
 }

authSchema.methods.comparePasswords = async function (userpassword) {
    const isMatch = await bcrypt.compare(userpassword, this.password)
    return isMatch
}

module.exports = mongoose.model('Auth', authSchema)