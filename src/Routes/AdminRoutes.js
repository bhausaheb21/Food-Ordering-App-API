const express = require('express');
const { AdminController } = require('../Controllers');

const adminRouter = express.Router()

adminRouter.get('/', AdminController.getVandors)
adminRouter.post('/', AdminController.createVandor)
adminRouter.get('/transactions', AdminController.getTransactions)
adminRouter.get('/transactions/:id', AdminController.getTransactionById)
adminRouter.get('/:id', AdminController.getVandorsbyId)

module.exports = adminRouter;