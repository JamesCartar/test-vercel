const express = require('express');

const { getAllMember, getMember, addMember, updateMember, deleteMember } = require('../controller/member.js');
const { getAllMemory, getMemory, addMemory, updateMemory, deleteMemory } = require('../controller/memory.js');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({success: true, msg: "Welcome from thuma api !"})
})

// app.use('/auth', authRoute)
// app.use('/members', authMiddleware, memberRoute)
// app.use('/memories', memoryRoute)

router.get('/members', getAllMember);
router.get('/memories', getAllMemory);

router.post('/members', addMember);
router.post('/memories', addMemory);

router.get('/members/:id', getMember);
router.get('/memories/:id', getMemory);

router.patch('/members/:id', updateMember);
router.patch('/memories/:id', updateMemory);

router.delete('/members/:id', deleteMember);
router.delete('/memories/:id', deleteMemory);

// router.route('/')
//     .post(addMember);

// router.route('/:id')
//     .get(getMember)
//     .patch(updateMember)
//     .delete(deleteMember);


module.exports = router;