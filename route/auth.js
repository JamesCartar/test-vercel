if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const router = require('express').Router();


const { register, login } = require('../controller/auth.js');

router.post('/register', register);
router.post('/login', login);

module.exports = router;