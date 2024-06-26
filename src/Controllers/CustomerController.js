const { Customer } = require("../Models");
const { getOtp, sendOTP } = require("../utilities/OTPService");
const { getSalt, encryptPass, getToken } = require("../utilities/authUtility");

class CustomerController {
    static async signup(req, res, next) {
        try {
            const { email, phone, password } = req.body;

            const exisitingCustomer = await Customer.findOne({ $or: [{ phone: phone }, { email: email }] })

            if (exisitingCustomer) {
                const error = new Error("Existing Account Associated with Mobile or Phone")
                error.status = 422;
                throw error;
            }
            const salt = await getSalt();
            const hashedpass = await encryptPass(password, salt)
            const { otp, otp_expiry } = getOtp();
            await sendOTP(otp, phone)

            const customer = new Customer({
                email: email,
                phone: phone,
                salt: salt,
                address: "",
                password: hashedpass,
                otp: otp,
                otp_expiry: otp_expiry,
                verified: false,
                firstname: "",
                lastName: "",
                lat: 0,
                lng: 0,
                pincode : 0
            });

            const custome = await customer.save();

            const payload = {
                id: custome._id,
                email: custome.email,
                name: custome.firstname,
                verified: custome.verified
            }

            const token = getToken(payload);
            return res.json({
                message: "SignUp Successful",
                token,
                verified: custome.verified
            })

        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async verify(req, res, next) {
        try {
            const id = req.user.id;
            const { otp } = req.body;
            const customer = await Customer.findById(id);
            if (parseInt(otp) === parseInt(customer.otp) && new Date() <= customer.otp_expiry) {
                customer.verified = true;
                const finalcustomer = await customer.save();
                const payload = {
                    id: finalcustomer._id,
                    email: finalcustomer.email,
                    name: finalcustomer.firstname,
                    verified: finalcustomer.verified
                }
                const token = getToken(payload);
                return res.status(200).json({
                    message: "Verification Successful",
                    token,
                    verified: finalcustomer.verified
                })
            }
            const error = new Error("Invalid OTP")
            error.status = 422;
            throw error;
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async getotp(req, res, next) {
        try {
            const id = req.user.id;
            const customer = await Customer.findById(id);

            if (!customer) {
                const error = new Error("Invalid Customer")
                error.status = 422;
                throw error;
            }
            const { otp, otp_expiry } = getOtp();
            await sendOTP(otp, customer.phone)
            customer.otp = otp;
            customer.otp_expiry = otp_expiry;
            await customer.save()
            return res.status(200).json({ message: "OTP send Successfully", customer })
        } catch (error) {
            next(error)
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const customer = await Customer.findOne({ email: email });

            if (!customer) {
                const error = new Error("Invalid Email")
                error.status = 422;
                throw error;
            }

            const match = (await encryptPass(password, customer.salt)).toString() === customer.password.toString();
            if (!match) {
                const error = new Error("Invalid Password");
                error.status = 422;
                throw error;
            }

            const payload = {
                id: customer._id,
                email: customer.email,
                name: customer.firstname,
                verified: customer.verified
            }
            const token = getToken(payload);
            return res.status(200).json({ message: "Login Successful", token, verified: customer.verified })

        } catch (error) {
            next(error)
        }
    }

    static async getCustomerProfile(req, res, next) {
        try {
            const id = req.user.id;

            const profile = await Customer.findById(id);
            if (!profile) {
                const error = new Error("Customer not Found")
                error.status = 404
                throw error;
            }

            return res.status(200).json({ message: "Profile Fetched Successfully", profile })

        } catch (error) {
            next(error)
        }
    }

    static async editCustomerProfile(req, res, next) {
        try {
            const { firstname, lastName, address} = req.body;
            const id = req.user.id;
            const profile = await Customer.findById(id);
            profile.address = address;
            profile.firstname = firstname;
            profile.lastName = lastName;
            const updatedprofile = await profile.save()
            return res.status(201).json({ message: "Updated Sucessfully", profile });
        } catch (error) {
            console.log(error);
            next(error)
        }

    }

}

module.exports = CustomerController