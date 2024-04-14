const express = require('express');
const { AdminController } = require('../Controllers');

const adminRouter = express.Router()

adminRouter.get('/', AdminController.getVandors)
adminRouter.get('/:id', AdminController.getVandorsbyId)
adminRouter.post('/', AdminController.createVandor)

module.exports = adminRouter;