const jwt = require('jsonwebtoken')


const generateToken = (payload)=>{
    console.log(process.env.SECRET);
    return jwt.sign(payload, process.env.SECRET )
}

const verifyToken = (token)=>{
    return jwt.verify(token, process.env.SECRET)
}

module.exports = {
    generateToken,
    verifyToken
}