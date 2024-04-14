const express = require('express')
const { CustomerController } = require('../Controllers')
const { isAuthenticated } = require('../middlewares/Authentication')


const CustomerRouter = express.Router()

CustomerRouter.post('/signup', CustomerController.signup)
CustomerRouter.post('/login', CustomerController.login)

CustomerRouter.use(isAuthenticated)
CustomerRouter.post('/verify', CustomerController.verify)
CustomerRouter.get('/getOTP', CustomerController.getotp)
CustomerRouter.get('/getProfile', CustomerController.getCustomerProfile)
CustomerRouter.patch('/updateProfile', CustomerController.editCustomerProfile)


module.exports = CustomerRouter