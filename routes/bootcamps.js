const express = require('express');
const {getBootcamp,getBootcamps,createBootcamp,deleteBootcamp,updateBootcamp} = require('../controllers/bootcamps');
const courseRouter = require('./courses')
const router = express.Router();


//Re-route into other routers

router.use('/:bootcampId/courses',courseRouter)

router.route('/').get(getBootcamps).post(createBootcamp);

router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);



module.exports = router;