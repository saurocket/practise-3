const {model,Schema} = require('mongoose')


const userSchema = Schema({
    firstName: {type: String, default: null},
    lastName: {type: String, default: null},
    email: {type: String,unique:true},
    password: {type: String},
    token: {type: String}
}, { versionKey: false, timestamps: true})


module.exports = model('user', userSchema)
