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
CustomerRouter.post('/create-order', CustomerController.createOrder);
CustomerRouter.get('/get-orders', CustomerController.getOrders);
CustomerRouter.get('/get-order/:orderid', CustomerController.getOrderbyID);

CustomerRouter.post('/addtoCart', CustomerController.addtoCart)
CustomerRouter.get('/getCart', CustomerController.getCart)
CustomerRouter.delete('/deleteCart', CustomerController.deleteCart)

//Create Payment and Verify Offer

CustomerRouter.get('/offer/:offerId/verify', CustomerController.verifyOffer);
CustomerRouter.post('/create-payment', CustomerController.createPayment)


module.exports = CustomerRouter