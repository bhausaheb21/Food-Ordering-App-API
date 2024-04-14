const Vandor = require("../Models/Vandor")

class ShoppingController {
    static async GetFoodAvailability(req, res, next) {
        try {
            const pincode = req.params.pincode;
            const vandors = await Vandor.find({ pincode: pincode, serviceAvailable: true })
                .populate("food")
                .sort({ 'rating': 'descending' })
            if (vandors.length > 0) {
                return res.status(200).json({
                    message: "Fetched Successfully",
                    vandors
                })
            }
            return res.status(200).json({ message: "Data not Found" })
        } catch (error) {
            next(error)
        }

    }

    static async GetTop10Restaurants(req, res, next) {
        try {
            const pincode = req.params.pincode;
            const restaurants = await Vandor.find({ pincode: pincode, serviceAvailable: true }).sort({ 'rating': 'descending' }).limit(10)
            if (restaurants.length > 0)
                return res.status(200).json({ message: "Fetched to 10 in your area Successfully", restaurants })
            return res.status(200).json({ message: "Data not Available" })
        }
        catch (error) {
            next(error)
        }
    }

    static async GetFoodin30Min(req, res, next) {
        try {
            const pincode = req.params.pincode;

            const vandors = await Vandor.find({ pincode: pincode, serviceAvailable: true }).populate('food')
                .sort({ 'rating': 'descending' })

            if (vandors.length > 0) {
                const foodItems = [];
                vandors.map((vandor) => {
                    const foods = vandor.food;
                    foodItems.push(...foods.filter((food) => food.readyTime <= 30))
                })

                return res.status(200).json({ message: "Fetched Successfully", foodItems })
            }
            return res.status(404).json({ message: "Data Not Found" })
        }
        catch (error) {
            next(error)
        }
    }

    static async getRestaurantById(req, res, next) {
        try {
            const id = req.params.id;
            const restaurant = await Vandor.findById(id).populate("food");
            if (!restaurant) {
                return res.status(404).json({ message: "Restaurant not Found" })
            }
            return res.status(200).json({ message: "Feteched Data of Restaurant", restaurant })
        } catch (error) {
            next(error)
        }
    }

    static async searchFoods(req, res, next) {
        try {
            const pincode = req.params.pincode;

            const vandors = await Vandor.find({ serviceAvailable: true, pincode: pincode }).populate('food').sort({ 'rating': "descending" })

            if (vandors.length > 0) {
                const foodArray = []
                vandors.map((vandor) => {
                    const foods = vandor.food;
                    foodArray.push(...foods)
                })
                return res.status(200).json({ message: "Fetched Successfully", foodArray })
            }

        } catch (error) {
            next(error)
        }
    }
}

module.exports = ShoppingController