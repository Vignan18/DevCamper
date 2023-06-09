const express = require('express');
const {getBootcamp,getBootcamps,createBootcamp,deleteBootcamp,updateBootcamp,bootcampPhotoUpload} = require('../controllers/bootcamps');
const courseRouter = require('./courses')
const advancedResults = require('../middleware/advanceResults')
const BootCamp = require('../models/Bootcamp')
const router = express.Router();

//Re-route into other routers

router.use('/:bootcampId/courses',courseRouter)

router.route('/').get(advancedResults(BootCamp,'courses'),getBootcamps).post(createBootcamp);

router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);

router.route('/:id/photo').put(bootcampPhotoUpload)



module.exports = router;