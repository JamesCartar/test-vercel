if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
let { ObjectId } = require('mongodb');
// model
const memoryModel = require('../model/memory.js');
const projectModel = require('../model/project.js');

// utils
const utils = require('../utils/password');
// milddleware utils
const { asyncWrapper } = require('../milddleware/async.js');
const { UnAuthenticatedError, NotFoundError } = require('../milddleware/errors');

const getAllMemory = asyncWrapper(async (req, res, next) => {
    const memories = await memoryModel.find({});

    res.status(200).json({
        success: true,
        memories: memories,
        });
});

const getMemory = asyncWrapper(async (req, res, next) => {
    const memory = await memoryModel.findById(req.params.id);

    res.status(200).json({
        success: true,
        memory: memory,
        });
});


const getAllProject = asyncWrapper(async (req, res, next) => {
    const foundProjects = await projectModel.find({}, { detail: 0 });
        
    res.status(200).json({
        success: true,
        projects: foundProjects,
    });
});

const getProject = asyncWrapper(async (req, res, next) => {
    const foundProject = await projectModel.findById(req.params.id);
        
    res.status(200).json({
        success: true,
        project: foundProject,
    });
});


module.exports = { getAllMemory, getMemory, getAllProject, getProject };