if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
let { ObjectId } = require('mongodb');
// model
const projectModel = require('../model/project.js');
const memberModel = require('../model/member.js');

// utils
const utils = require('../utils/password');
// milddleware utils
const { asyncWrapper } = require('../milddleware/async.js');
const { UnAuthenticatedError, NotFoundError } = require('../milddleware/errors');


const getAllProject = asyncWrapper(async (req, res, next) => {
    const projectPerPage = req.query.projectPerPage
        ? parseInt(req.query.projectPerPage, 10)
        : 20;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    let filters = {};
    let sortString = "createdAt";
    let descendingOrDecending = -1;

    if (req.query.search) {
        filters = {
            title: { $regex: req.query.search, $options: "i" }
        }
    }

    switch (req.query.sort) {
        case "a_to_z":
        sortString = "title";
        descendingOrDecending = 1;
        break;
        case "z_to_a":
        sortString = "title";
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
    
    const total_results = await projectModel.countDocuments(filters);
    const foundProjects = await projectModel
        .find(filters)
        .limit(projectPerPage)
        .skip(projectPerPage * page)
        .sort({ [sortString]: descendingOrDecending })

    res.status(200).json({
        success: true,
        total_results: total_results,
        found_results: foundProjects.length,
        page: page,
        entries_per_page: projectPerPage,
        projects: foundProjects,
        });
});

const addProject = asyncWrapper(async (req, res, next) => {
    const oldProject = await projectModel.findOne({ title: req.body.title });
    if (oldProject) {
        return res.status(409).json({ success: false, msg: 'Project already exists !' });
    } else {
        const newProject = await projectModel.create(req.body);
        return res.status(201).json({ success: true, msg: `Project called "${newProject.title}" has been added !` });
    }
});

const getProject = asyncWrapper (async (req, res, next) => {
    const project = await projectModel.findById(req.params.id);
    if (!project) {
        throw new NotFoundError(`Project with the id of ${req.params.id} does not exist !`);
    } 
    return res.status(200).json({ success: true, project: project });
});

const updateProject = asyncWrapper( async (req, res, next) => {
    const oldProject = await projectModel.findOne({ _id: ObjectId(req.params.id) });
    if(oldProject) {
        let dataToUpdate = req.body;
        
        await projectModel.updateOne({ _id: ObjectId(req.params.id) }, { $set: dataToUpdate }, { new: true });
        return res.status(200).json({ success: true, msg: `Project with the id of ${req.params.id} has been updated !` });
    } else {
        throw new NotFoundError(`Project with the id of ${req.params.id} does not exist !`);
    }   
});

const deleteProject = asyncWrapper(async (req, res, next) => {
    const oldProject = await projectModel.findOne({ _id: ObjectId(req.params.id) });
    if(oldProject) {
        await projectModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({ success: true, msg: `Project with the id of ${req.params.id} has been deleted!` });
    } else {
        throw new NotFoundError(`Project with the id of ${req.params.id} does not exist !`);
    }
});




module.exports = { getAllProject, getProject, addProject, updateProject, deleteProject };