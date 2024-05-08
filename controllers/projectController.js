const catchAsync = require('../utils/catchAsync');
const project = require('../db/models/project');
const user = require('../db/models/user')
const AppError = require('../utils/appError');

const createProject = catchAsync(async(req, res, next) => {
    const body = req.body;
    const userId = req.user.id;

    const newProject = await project.create({
        createdBy: userId,
        title: body.title,
        description: body.description,
        jsonValue: body.jsonValue,
    });

    return res.status(201).json({
        status: "success",
        data: newProject
    });
});

const getAllProject = catchAsync(async(req, res, next) => {
    const userId = req.user.id;
    const result = await project.findAll({ include: user, where: {createdBy: userId} });

    return res.json({
        status: "success",
        data: result
    });
});

const getProjectById = catchAsync(async(req, res, next) => {
    const userId = req.user.id;
    const projectId = req.params.id;
    const result = await project.findOne({ include: user, where: {id: projectId, createdBy: userId} });

    if (!result) {
        return next(new AppError('Invalid project id', 400));
    }

    return res.json({
        status: "success",
        data: result
    });
});

const updateProject = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const projectId = req.params.id;
    const body = req.body;

    const result = await project.findOne({where: {id: projectId, createdBy: userId}});

    if (!result) {
        return next(new AppError('Invalid project id'), 400);
    }

    result.title = body.title;
    result.description = body.description;
    result.jsonValue = body.jsonValue;

    const updatedResult = await result.save();

    return res.json({
        status: "success",
        data: updatedResult
    });
});

const deleteProject = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const projectId = req.params.id;

    const result = await project.findOne({where: {id: projectId, createdBy: userId}});

    if (!result) {
        return next(new AppError('Invalid project id'), 400);
    }

    await result.destroy();

    return res.json({
        status: "success",
        message: "Record deleted successfully"
    });
});

module.exports = { createProject, getAllProject, getProjectById, updateProject, deleteProject };
