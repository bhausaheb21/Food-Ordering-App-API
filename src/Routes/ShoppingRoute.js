const express = require('express')
const { ShoppingController } = require('../Controllers')

const ShoppingRouter = express.Router()

ShoppingRouter.get('/:pincode', ShoppingController.GetFoodAvailability)
ShoppingRouter.get('/gettop10/:pincode', ShoppingController.GetTop10Restaurants)
ShoppingRouter.get('/getfood30min/:pincode', ShoppingController.GetFoodin30Min)
ShoppingRouter.get('/getRestaraunt/:id', ShoppingController.getRestaurantById)
ShoppingRouter.get('/searchfood/:pincode', ShoppingController.searchFoods   )
module.exports = ShoppingRouter

