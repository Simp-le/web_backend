require('dotenv').config({path: `${process.cwd()}/.env`});
const express = require('express');

const authRouter = require('./routes/authRoute');
const projectRouter = require('./routes/projectRoute');
const userRouter = require('./routes/userRoute');
const AppError = require('./utils/appError');
const catchAsync = require('./utils/catchAsync');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
const PORT = process.env.APP_PORT || 4000;

app.use(express.json()); // convert data to json

// Routes:
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/users', userRouter)
app.use('*', catchAsync(
    (req, res, next) => {
        throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
    })
);

app.use(globalErrorHandler); // Global Error Handler

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});