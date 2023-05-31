const express = require('express');

const { getAllMember, getMember, addMember, updateMember, deleteMember, changePassword } = require('../controller/member.js');

const router = express.Router();

router.route('/')
    .get(getAllMember)
    .post(addMember);

    
router.patch('/changePassword', changePassword);

router.route('/:id')
    .get(getMember)
    .patch(updateMember)
    .delete(deleteMember);


module.exports = router;