const express = require('express')

const { getAllMemory, getMemory, addMemory, updateMemory, deleteMemory } = require('../controller/memory.js')

const router = express.Router()

router.route('/')
    .get(getAllMemory)
    .post(addMemory)

router.route('/:id')
    .get(getMemory)
    .patch(updateMemory)
    .delete(deleteMemory)


module.exports = router