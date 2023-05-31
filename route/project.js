const express = require('express')

const { getAllProject, getProject, addProject, updateProject, deleteProject } = require('../controller/project.js')

const router = express.Router()

router.route('/')
    .get(getAllProject)
    .post(addProject)

router.route('/:id')
    .get(getProject)
    .patch(updateProject)
    .delete(deleteProject)


module.exports = router