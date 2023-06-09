const express = require('express');
const dotenv = require('dotenv');
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const morgan = require('morgan');
const connectDB = require('./config/db');
const { Promise } = require('mongoose');
const errorHandler = require('./middleware/error')
//load env files
dotenv.config({ path: './config/config.env' });



const app = express();

//body parser
app.use(express.json())


//Connect to Database;
connectDB();

//dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/api/v1/bootcamps/', bootcamps)
app.use('/api/v1/courses/', courses)
app.use(errorHandler)

const PORT = process.env.port || 6000
const server = app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

//handle unhandled promise rejections
process.on('unhandledRejection', (err, Promise) => {
    console.log('Unhandled rejection', err.message);
    //close server
    server.close(() => process.exit(1));
})