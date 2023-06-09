const express = require('express');
const dotenv = require('dotenv');
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser');

const path = require('path');
//load env files
dotenv.config({ path: './config/config.env' });



const app = express();

// Cookie parser
app.use(cookieParser());

//body parser
app.use(express.json())

//set static folder
app.use(express.static(path.join(__dirname,'public')))


//Connect to Database;
connectDB();

//dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//for uploading file
app.use(fileupload())

app.use('/api/v1/bootcamps/', bootcamps)
app.use('/api/v1/courses/', courses)
app.use('/api/v1/auth',auth)
app.use(errorHandler)

const PORT = process.env.port || 6000
const server = app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

//handle unhandled promise rejections
process.on('unhandledRejection', (err, Promise) => {
    console.log('Unhandled rejection', err.message);
    //close server
    server.close(() => process.exit(1));
})