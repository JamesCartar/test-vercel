const express = require('express');

const { getAllMember, getMember, addMember, updateMember, deleteMember } = require('../controller/member.js');

const router = express.Router();

router.route('/')
    .get(getAllMember)
    .post(addMember);

router.route('/:id')
    .get(getMember)
    .patch(updateMember)
    .delete(deleteMember);


module.exports = router;