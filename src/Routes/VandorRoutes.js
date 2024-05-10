const express = require('express')
const path = require('path')
const crypto = require('crypto')

const { VandorController } = require('../Controllers')
const { isAuthenticated } = require('../middlewares/Authentication')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log();
        cb(null, path.join(__dirname, '..', '..', 'images/'))
    },
    filename: (req, file, cb) => {
        // console.log(file);
        const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
        cb(null, timestamp + '_' + file.originalname)
    }
})

const images = multer({ storage }).array('images', 10)
const VandorRouter = express.Router()

VandorRouter.post('/login', VandorController.LoginVandor)
VandorRouter.get('/food', VandorController.getFood)

VandorRouter.use(isAuthenticated)
VandorRouter.get('/profile', VandorController.getProfile)

VandorRouter.get('/orders', VandorController.getOrders)
VandorRouter.get('/order/:orderId', VandorController.getOrderbyId)
VandorRouter.post('/orders/:orderId/process', VandorController.processOrder)
VandorRouter.get('/profile', VandorController.getProfile)
// VandorRouter.get('/profile', VandorController.getProfile)
// VandorRouter.patch('/update-profile', VandorController.getProfile)

VandorRouter.get('/offers', VandorController.getOffers)
VandorRouter.post('/offer', VandorController.createOffer)
VandorRouter.put('/offer/:id', VandorController.editOffer)

VandorRouter.patch('/update-profile', VandorController.updateProfile)
VandorRouter.patch('/update-vandor-service', VandorController.updateService)
VandorRouter.post('/create-food', images, VandorController.createFood)
VandorRouter.patch('/add_cover_images', images, VandorController.addCoverImages)

module.exports = VandorRouter