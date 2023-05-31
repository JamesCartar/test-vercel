if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const { asyncWrapper } = require("../milddleware/async.js");
const memberModel = require('../model/member.js');
const utils = require('../utils/password');

const register = asyncWrapper(async (req, res, next) => {
    const { password, name, email, phone, position, department, role, profileImage } = req.body;
    if ( !password || !name || !email || !phone )
        return res.status(400).json({ success: false, msg: "Please provide all the necessity fields !" });

    const userExist = await memberModel.findOne({ email: req.body.email });
    if (userExist)
    return res
        .status(409)
        .json({ success: false, msg: "User already exists!" });

    const saltHash = utils.genPassword(password);
    req.body.salt = saltHash.salt;
    req.body.password = saltHash.hash;

    const newUser = new memberModel(req.body);
    const user = await newUser.save();
    const jwt = utils.issueJWT(user);


    return res.status(201).json({
    success: true,
    data: user,
    token: jwt.token,
    expires: jwt.expires,
    });
});

const login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password )
      return res.status(400).json({ success: false, msg: "Please provide all the necessty fields !" });

    const user = await memberModel.findOne(
        { email: req.body.email }
    ).lean();

    if (!user)
    return res.status(401).json({ success: false, msg: "Could not find the user !" });

    if (user.status === "leave")
        return res.status(400).json({success: false, msg: "You are on leave time !" });

    const isValid = utils.validPassword(req.body.password,user.password,user.salt
    );

    if (isValid) {
        delete user.salt;
        delete user.password;
        const tokenObject = utils.issueJWT(user);
        user.token = tokenObject.token;
        user.expires = tokenObject.expires;

        res.status(200).json({ success: true, user: user });
    } else {
        res.status(401).json({ success: false, msg: "You entered the wrong password !" });
    }
};



module.exports = { register, login };