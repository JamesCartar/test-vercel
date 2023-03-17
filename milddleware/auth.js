require('dotenv').config();
const jsonwebtoken = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { asyncWrapper } = require('../milddleware/async.js');
const { UnAuthenticatedError } = require('../milddleware/errors');


const pathToKey = path.join(__dirname + '/../keys', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8')

const authMiddleware = asyncWrapper(async (req, res, next) => {
    if (!req.headers.authorization) {
        return next(new UnAuthenticatedError('You are not authorized to visit this route!'));
    } else {
        const tokenParts = req.headers.authorization.split(' ');
        if (tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {
            const verification = jsonwebtoken.verify(tokenParts[1], PUB_KEY, { algorithms: ['RS256'] });
            req.jwt = verification;
            return next();
        } else {
            return next(new UnAuthenticatedError('You are not authorized to visit this route!'));
        }
       
    }
})


module.exports = { authMiddleware };