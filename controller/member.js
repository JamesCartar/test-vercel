if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
let { ObjectId } = require('mongodb');
// model
const memberModel = require('../model/member.js');

// utils
const utils = require('../utils/password');
// milddleware utils
const { asyncWrapper } = require('../milddleware/async.js');
const { UnAuthenticatedError, NotFoundError } = require('../milddleware/errors');


const getAllMember = asyncWrapper(async (req, res, next) => {
    const member = await memberModel.findOne({ position: req.jwt.position });
    if (member.position) {
      const memberPerPage = req.query.memberPerPage
        ? parseInt(req.query.memberPerPage, 10)
        : 20;
      const page = req.query.page ? parseInt(req.query.page) : 0;
      let filters = {};
      let sortString = "createdAt";
      let descendingOrDecending = 1;
  
      if (req.query.search) {
        filters = {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
          ],
        };
      } else {
        if (req.query.name) {
            filters = { $text: { $search: new RegExp(req.query.name, "i") } };
        } else if (req.query.email) {
            filters = { email: { $eq: new RegExp(req.query.email, "i") } };
        } else if (req.query.phone) {
            filters = { phone: { $eq: new RegExp(req.query.phone, "i") } };
        } else if (req.query.department) {
            filters = { department: { $eq: new RegExp(req.query.department, "i") } };
        } else if (req.query.position) {
            filters = { position: { $eq: new RegExp(req.query.position, "i") } };
        } else if (req.query.status) {
            filters = { status: { $eq: new RegExp(req.query.status, "i") } };
        }
      }
  
      switch (req.query.sort) {
        case "a_to_z":
          sortString = "name";
          descendingOrDecending = 1;
          break;
        case "z_to_a":
          sortString = "name";
          descendingOrDecending = -1;
          break;
        case "createdAt":
          sortString = "createdAt";
          descendingOrDecending = -1;
          break;
        case "updatedAt":
          sortString = "updatedAt";
          descendingOrDecending = -1;
      }
      
        const total_results = await memberModel.countDocuments(filters);
        const searchFoundBooks = await memberModel.countDocuments({
          $or: [
            { name: { $regex: "^" + req.query.search, $options: "i" } },
            { email: { $regex: "^" + req.query.search, $options: "i" } }
          ],
        });
        const foundMembers = await memberModel
          .find(filters)
          .limit(memberPerPage)
          .skip(memberPerPage * page)
          .sort({ [sortString]: descendingOrDecending })
  
        res.status(200).json({
            success: true,
            total_results: req.query.search ? searchFoundBooks : total_results,
            found_results: foundMembers.length,
            page: page,
            entries_per_page: memberPerPage,
            members: foundMembers,
          });
    } else {
        throw new UnAuthenticatedError();
    }

});

const addMember = asyncWrapper(async (req, res, next) => {
    const member = await memberModel.findOne({ position: req.jwt.position });
    if (member.position.toLowerCase() == 'head') {
        const oldMember = await memberModel.findOne({ email: req.body.email });
        if (oldMember && req.body.email) { 
            return res.status(409).json({ success: false, msg: 'Member already exists !' });
        } else {
            if(req.body.password) {
                const saltHash = utils.genPassword(req.body.password);
                req.body.salt = saltHash.salt;
                req.body.password = saltHash.hash;
            }

            const newMember = await memberModel.create(req.body);
            return res.status(201).json({ success: true, msg: `Member called "${newMember.name}" has been added !` });
        }
    } else {
        throw new UnAuthenticatedError();
    }
});

const getMember = asyncWrapper (async (req, res, next) => {
    const member = await memberModel.findOne({ position: req.jwt.position });
    if (member.position) {
        const member = await memberModel.findById(req.params.id);
        if (!member) {
            throw new NotFoundError(`Member with the id of ${req.params.id} does not exist !`);
        } 
        return res.status(200).json({ success: true, member: member });
    } else {
        throw new UnAuthenticatedError();
    }
})

const updateMember = asyncWrapper( async (req, res, next) => {
    const member = await memberModel.findOne({ position: req.jwt.position });
    
    if (member.position.toLowerCase() == 'head') {
        const oldMember = await memberModel.findOne({ _id: ObjectId(req.params.id) });
        if(oldMember) {
            if(req.body.password) {
                const saltHash = utils.genPassword(req.body.password);
                req.body.salt = saltHash.salt;
                req.body.password = saltHash.hash;
            } else {
                delete req.body.password;
            }
            if(req.body.profileImage === null) {
                delete req.body.profileImage;
            }
            const dataToUpdate = req.body;
            await memberModel.updateOne({ _id: ObjectId(req.params.id) }, { $set: dataToUpdate }, { new: true });
            return res.status(200).json({ success: true, msg: `Member with the id of ${req.params.id} has been updated !` });
        } else {
            throw new NotFoundError(`Member with the id of ${req.params.id} does not exist !`);
        }
    } else {
        throw new UnAuthenticatedError();
    }
});

const deleteMember = asyncWrapper(async (req, res, next) => {
    const member = await memberModel.findOne({ position: req.jwt.position });
    if (member.position.toLowerCase() == 'head') {
        const oldMember = await memberModel.findOne({ _id: ObjectId(req.params.id) });
        if(oldMember) {
            await memberModel.findByIdAndDelete(req.params.id);
            return res.status(200).json({ success: true, msg: `Member with the id of ${req.params.id} has been deleted!` });
        } else {
            throw new NotFoundError(`Member with the id of ${req.params.id} does not exist !`);
        }
    } else {
        throw new UnAuthenticatedError();
    }
});

const changePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword )
      return res.status(400).json({ success: false, msg: "Please provide all the necessty fields !" });

    const user = await memberModel.findById(req.jwt.sub);
    if (!user) return res.status(401).json({ success: false, msg: "Could not find the user !" });

    if (user.status === "leave")
        return res.status(400).json({success: false, msg: "You are on leave time !" });


    const isValid = utils.validPassword(req.body.oldPassword, user.password,user.salt);

    if (isValid) {
        const saltHash = utils.genPassword(newPassword);
        user.salt = saltHash.salt;
        user.password = saltHash.hash;

        await user.save();
        
        res.status(200).json({ success: true, msg: "You have changed your password successfully !" });
    } else {
        res.status(401).json({ success: false, msg: "You entered the wrong password !" });
    }
};




module.exports = { getAllMember, getMember, addMember, updateMember, deleteMember, changePassword };