const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const user = require('../db/models/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

const signup = catchAsync( async (req, res, next) => {
    const body = req.body;

    if (!['1'].includes(body.type)) { // currently, only user, admin cannot signup
        throw new AppError('User type is invalid', 400); // bad request
    }

    const newUser = await user.create({
        username: body.username,
        type: body.type,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword
    });

    if (!newUser) {
        return next(new AppError('Failed to create the user', 400));
    }

    const result = newUser.toJSON()

    delete result.password;

    result.token = generateToken({
        id: result.id
    });

    return res.status(201).json({
        status: 'success',
        data: result
    })
});

const login = catchAsync( async (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return next(new AppError('Provide email and password', 400));
    }

    const result = await user.findOne({ where: { email } });
    if (!result || !(await bcrypt.compare(password, result.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    const token = generateToken({ id: result.id, });

    return res.json({
        status: "success",
        token
    })
});

const authentication = catchAsync( async (req, res, next) => {
    // Get the token from headers
    let idToken = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // req.headers.authorization = 'Bearer [token is here]'
        idToken = req.headers.authorization.split(' ')[1];
    }
    if (!idToken) { // token is missing
        return next(new AppError('Please login to get access', 401));
    }

    // Token verification
    const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET); // verify token

    // Get the user details from the db and add it to the request object
    const freshUser = await user.findByPk(tokenDetail.id); // generateToken({ id: result.id }

    if (!freshUser) {
        return next(new AppError('User no longer exists', 400));
    }

    req.user = freshUser;
    return next(); // in projectRoute -> router.route('/').post(authentication, createProject), so next() will call createProject method or Error (globalErrorHandler), if something went wrong
});

const restrictTo = (...type) => {
    const checkPermission = (req, res, next) => {
        if (!type.includes(req.user.type)) { // only users with the same user type as we pass in ...type will get access, otherwise
            return next(new AppError("You don't have permission to perform this action", 403));
        }
        return next();
    }

    return checkPermission;
}

module.exports = { signup, login, authentication, restrictTo };
