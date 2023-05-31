const express = require('express')

const { getAllMemory, getMemory, getAllProject, getProject } = require('../controller/website.js')

const router = express.Router()

router.get('/memories', getAllMemory)
router.get('/memories/:id', getMemory)
router.get('/projects', getAllProject)
router.get('/projects/:id', getProject)


module.exports = router