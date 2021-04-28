const bcrypt = require('bcrypt')
const salt = 10

const hashPassword = (password)=>{
    return bcrypt.hashSync(password,salt)
}

const comparePassword = (input, hashPass)=>{
    return bcrypt.compareSync(input, hashPass)
}


module.exports = {
    hashPassword,
    comparePassword
}