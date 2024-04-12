const jwt = require('jsonwebtoken');

const generateToken = (id) =>{
    return jwt.sign({id},"shabaaz",{
        expiresIn:"30d"
    })
}

module.exports = {generateToken};