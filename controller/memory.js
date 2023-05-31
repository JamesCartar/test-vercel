if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
let { ObjectId } = require('mongodb');
// model
const memoryModel = require('../model/memory.js');
const memberModel = require('../model/member.js');

// utils
const utils = require('../utils/password');
// milddleware utils
const { asyncWrapper } = require('../milddleware/async.js');
const { UnAuthenticatedError, NotFoundError } = require('../milddleware/errors');


const getAllMemory = asyncWrapper(async (req, res, next) => {
    const memoryPerPage = req.query.memoryPerPage
        ? parseInt(req.query.memoryPerPage, 10)
        : 20;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    let filters = {};
    let sortString = "createdAt";
    let descendingOrDecending = 1;

    if (req.query.search) {
        filters = {$or: [{title: { $regex: req.query.search, $options: "i" }}, {location: { $regex: req.query.search, $options: "i" }}] }  
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
    
    const total_results = await memoryModel.countDocuments(filters);
    const searchFoundMemories = await memoryModel.countDocuments({$or: [{title: { $regex: "^" + req.query.search, $options: "i" }}, {location: { $regex: "^" + req.query.search, $options: "i" }}] });
    const foundMemorys = await memoryModel
        .find(filters)
        .limit(memoryPerPage)
        .skip(memoryPerPage * page)
        .sort({ [sortString]: descendingOrDecending })

    res.status(200).json({
        success: true,
        total_results: req.query.search ? searchFoundMemories : total_results,
        found_results: foundMemorys.length,
        page: page,
        entries_per_page: memoryPerPage,
        memories: foundMemorys,
        });
});

const addMemory = asyncWrapper(async (req, res, next) => {
    const oldMemory = await memoryModel.findOne({ title: req.body.title });
    if (oldMemory) {
        return res.status(409).json({ success: false, msg: 'Memory already exists !' });
    } else {
        if(req.body.memory[0] == "data:") {
            req.body.memory = [];
        }
        const newMemory = await memoryModel.create(req.body);
        return res.status(201).json({ success: true, msg: `Memory called "${newMemory.title}" has been added !` });
    }
});

const getMemory = asyncWrapper (async (req, res, next) => {
    const memory = await memoryModel.findById(req.params.id);
    if (!memory) {
        throw new NotFoundError(`Memory with the id of ${req.params.id} does not exist !`);
    } 
    return res.status(200).json({ success: true, memory: memory });
});

const updateMemory = asyncWrapper( async (req, res, next) => {
    const oldMemory = await memoryModel.findOne({ _id: ObjectId(req.params.id) });
    if(oldMemory) {
        let dataToUpdate = req.body;
        if(dataToUpdate.totalPerticepents) {
            dataToUpdate.totalPerticepents = Number(dataToUpdate.participents);
        }
        await memoryModel.updateOne({ _id: ObjectId(req.params.id) }, { $set: dataToUpdate }, { new: true });
        return res.status(200).json({ success: true, msg: `Memory with the id of ${req.params.id} has been updated !` });
    } else {
        throw new NotFoundError(`Memory with the id of ${req.params.id} does not exist !`);
    }   
});

const deleteMemory = asyncWrapper(async (req, res, next) => {
    const oldMemory = await memoryModel.findOne({ _id: ObjectId(req.params.id) });
    if(oldMemory) {
        await memoryModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({ success: true, msg: `Memory with the id of ${req.params.id} has been deleted!` });
    } else {
        throw new NotFoundError(`Memory with the id of ${req.params.id} does not exist !`);
    }
});




module.exports = { getAllMemory, getMemory, addMemory, updateMemory, deleteMemory };