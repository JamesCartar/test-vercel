require('dotenv').config();
const jsonwebtoken = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { asyncWrapper } = require('../milddleware/async.js');
const { UnAuthenticatedError } = require('../milddleware/errors');


const pathToKey = path.join(__dirname + '/../keys', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8')

const websiteMiddleware = asyncWrapper(async (req, res, next) => {
    if (!req.headers.device) {
        return next(new UnAuthenticatedError('You are not authorized to visit this route!'));
    } else {
        return next();
    }
})


module.exports = { websiteMiddleware };