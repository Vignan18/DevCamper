const express = require('express');
const {getBootcamp,getBootcamps,createBootcamp,deleteBootcamp,updateBootcamp,bootcampPhotoUpload} = require('../controllers/bootcamps');
const courseRouter = require('./courses')
const advancedResults = require('../middleware/advanceResults')
const BootCamp = require('../models/Bootcamp')
const router = express.Router();

const { protect,authorize} = require("../middleware/auth")

//Re-route into other routers

router.use('/:bootcampId/courses',courseRouter)

router.route('/').get(advancedResults(BootCamp,'courses'),getBootcamps).post(protect,authorize('publisher','admin'),createBootcamp);

router.route('/:id').get(getBootcamp).put(protect,authorize('publisher','admin'),updateBootcamp).delete(protect,authorize('publisher','admin'),deleteBootcamp);

router.route('/:id/photo').put(protect,authorize('publisher','admin'),bootcampPhotoUpload)

module.exports = router;