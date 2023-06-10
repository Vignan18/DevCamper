const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Bootcamp = require("../models/Bootcamp")
const path = require('path');

//@desc  Get all bootcamps
// @route GET /api/v1/bootcamps
//@access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
})

//@desc  Get single bootcamps
// @route GET /api/v1/bootcamps/:id
//@access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`BootCamp not found with id of ${req.params.id}`, 404))
    }
    res.status(200).json({ success: true, msg: bootcamp })

})

//@desc  Create new bootcamp
// @route POST /api/v1/bootcamps
//@access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {

    // Add user to req,body
    req.body.user = req.user.id;

    
    // Check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

    // If the user is not an admin, they can only add one bootcamp
    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `The user with ID ${req.user.id} has already published a bootcamp`,
                400
            )
        );
    }

    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success: true,
        data: bootcamp
    });

}
)
//@desc  Update  bootcamp
// @route put /api/v1/bootcamps/:id
//@access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

    let bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!bootcamp) {
        return next(new ErrorResponse(`BootCamp not found with id of ${req.params.id}`, 404))
    }
    res.status(200).json({ success: true, data: bootcamp })


})


//@desc  delete  bootcamp
// @route delete /api/v1/bootcamps/:id
//@access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

    let bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`BootCamp not found with id of ${req.params.id}`, 404))
    }
    bootcamp.deleteOne();
    res.status(200).json({ success: true, data: "deleted successfully" })


})


//@desc  upload photo for bootcamp
// @route put /api/v1/bootcamps/:id/photo
//@access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {

    let bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`BootCamp not found with id of ${req.params.id}`, 404))
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload files`, 404))
    }

    const file = req.files.file;

    //Make sure image is photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 404))
    }

    //check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 404))
    }

    //create custom file name
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.log(err)
            return next(new ErrorResponse(`Problem with file upload`, 500))
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
        res.status(200).json({
            success: true,
            data: file.name
        })

    })
})

