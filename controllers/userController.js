const catchAsync = require('../utils/catchAsync');
const { Sequelize } = require('sequelize');
const user = require('../db/models/user');

const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await user.findAndCountAll({
        where: {
            type: {
                [Sequelize.Op.ne]: '0'  // We don't need to show admins themselves in the response. ne - not equal to
            }
        },
        attributes: { exclude: ['password'] } // We don't show passwords to the admin
    });

    return res.status(200).json({
        status: "success",
        data: users
    });
});

module.exports = { getAllUsers };
