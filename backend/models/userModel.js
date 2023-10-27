const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema

const userSchema = new Schema({
    fullName : {
        type : String,
        required: true
    },

    email : {
        type : String,
        required: true,
        unique: true
    },

    // userName : {
    //     type : String,
    //     required: true,
    //     unique: true
    // },

    password : {
        type : String,
        required: true
    },

    // confirmPassword : {
    //     type : String,
    //     required: true
    // },

    // userType : {
    //     type : String,
    //     required : true
    // }
})

userSchema.statics.signup = async function(fullName, email, password){

    const emailExist = await this.findOne({ email })

    if (emailExist) {
        throw Error('Email already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ fullName, email, password: hash})

    return user
}


userSchema.statics.login =  async function(email, password){
       if(!email || !password){
        throw Error('Email or Password invalid')
       }

       const userExist = await this.findOne({ email })

       if(!userExist){
             throw Error('Incorrect email')
}

     const match = await bcrypt.compare(password, userExist.password)

     if(!match){
        throw Error('Incorrect Password')
     }

     return userExist;
}

module.exports = mongoose.model('User', userSchema)