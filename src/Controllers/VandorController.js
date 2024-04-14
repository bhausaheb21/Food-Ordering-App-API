const { Vandor, Food } = require("../Models");
const { encryptPass, getToken } = require("../utilities/authUtility");
const jwt = require('jsonwebtoken')

class VandorController {
    static async LoginVandor(req, res, next) {
        try {
            const { email, password } = req.body;
            const vandor = await Vandor.findOne({ email: email });

            if (!vandor) {
                const error = new Error("Vandor not Found")
                error.status = 404;
                throw error;
            }

            const hashedpass = await encryptPass(password, vandor.salt);
            if (hashedpass !== vandor.password) {
                const error = new Error("Invalid Password")
                error.status = 404;
                throw error;
            }
            const payload = {
                email: vandor.email,
                name: vandor.name,
                ownerName: vandor.ownerName,
                id: vandor._id,
            }

            const token = getToken(payload)

            return res.status(200).json(token)

        }
        catch (error) {
            next(error)
        }
    }

    static async getProfile(req, res, next) {
        try {
            const id = req.user.id;
            const vandor = await Vandor.findById(id)
            return res.status(200).json(vandor)
        } catch (error) {
            next(error);
        }
    }

    static async updateProfile(req, res, next) {
        try {
            const { name, ownerName, address } = req.body;
            const id = req.user.id;
            const vandor = await Vandor.findById(id);
            vandor.name = name;
            vandor.ownerName = ownerName;
            vandor.address = address;
            await vandor.save()
            return res.status(201).json({ message: "Updated Succesfully" })
        } catch (error) {
            next(error)
        }
    }

    static async updateService(req, res, next) {
        try {
            const id = req.user.id;
            const vandor = await Vandor.findById(id);
            if (!vandor) {
                const error = new Error("Vandor Not Found");
                error.status = 404;
                throw error;
            }
            vandor.serviceAvailable = !vandor.serviceAvailable;
            await vandor.save()
            return res.status(201).json({ message: "Updated Successfully" })
        } catch (error) {
            next(error)
        }
    }

    static async createFood(req, res, next) {
        try {
            const id = req.user.id;
            const { description, name, foodType, readyTime, price } = req.body;

            const vandor = await Vandor.findById(id);
            if (!vandor) {
                const error = new Error("Vandor Not Found");
                error.status = 404;
                throw error;
            }
            const files = req.files;
            const filenames = files.map((value) => value.filename)
            const food = new Food({ description, name, foodType, readyTime, price, images: filenames, rating: 0, vandorId: id })
            await food.save()
            vandor.food.push(food._id);
            await vandor.save();
            return res.status(201).json({ message: "Food created Succesfully", vandor })
        } catch (error) {
            next(error)
        }
    }

    static async getFood() {
        try {
            const food = await Food.find()
            return res.status(200).json({ message: "Fetched Successfully", food })
        } catch (error) {
            next(error)
        }
    }

    static async addCoverImages(req, res, next) {
        try {
            const id = req.user.id;
            const vandor = await Vandor.findById(id);
            if (!vandor) {
                const error = new Error("Not Vandor Found");
                error.status = 404;
                throw error;
            }
            const files = req.files;
            const filenames = files.map((val) => val.filename)
            console.log(filenames);
            vandor.coverImages.push(...filenames);
            await vandor.save()
            return res.status(201).json({ message: "Images added Successfully", vandor })

        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}

module.exports = VandorController