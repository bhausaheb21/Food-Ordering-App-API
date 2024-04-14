exports.getOtp = () => {
    const otp = Math.round(Math.random() * 900000 + 100000);
    let currentTime = new Date();
    let otp_expiry = new Date(currentTime.getTime() + 30 * 60000);
    return { otp, otp_expiry }
}

exports.sendOTP = async (otp, phone) => {
    try {
        const client = require('twilio')(process.env.accountSid, process.env.authToken)
        await client.messages.create({
            to: `+91${phone}`,
            body: `OTP for Food Delivery App ${otp}`,
            from: "+12055574570"
        })
        console.log("Sent Successfully");
    } catch (error) {
        console.log(error);
    }
}