const { Vandor } = require("../Models");
const { getSalt, encryptPass } = require("../utilities/authUtility");


class AdminController {
    static async createVandor(req, res, next) {
        try {
            const { name, address, foodType, email, password, ownerName, phone, pincode } = req.body;
            const existingVandor = await Vandor.findOne({ email: email, serviceAvailable : true });
            if (existingVandor) {
                return res.status(409).json({ message: "Vandor already exist" });
            }
            const salt = await getSalt();
            const hashedpass = await encryptPass(password, salt);
            const vandor = new Vandor({
                name,
                email,
                password: hashedpass,
                salt,
                rating: 0,
                ownerName,
                address,
                foodType, phone,
                serviceAvailable: true,
                pincode,
                coverImages: []
            });

            const newvandor = await vandor.save();
            return res.status(201).json({ vandor: newvandor });
        }
        catch (err) {
            next(err)
        }

    }

    static async getVandors(req, res, next) {
        try {
            const vandors =await  Vandor.find({ serviceAvailable: true });
            return res.status(200).json({ message: "Fetching Successful", vandors })
        } catch (error) {
            next(error)
        }
    }

    static async getVandorsbyId(req, res, next) {
        try {
            const vendorId = req.params.id;
            const vandor =await  Vandor.findById(vendorId);
            return res.status(200).json({ message: "Fetching Successful", vandor })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

}

module.exports = AdminController