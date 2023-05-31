const express = require('express')

const { getAllMemory, getAllProject, getProject } = require('../controller/website.js')

const router = express.Router()

router.get('/memories', getAllMemory)
router.get('/projects', getAllProject)
router.get('/projects/:id', getProject)


module.exports = router