const express = require('express')
const { connectDB } = require('./config/db.config')
const { adminRouter, VandorRouter, ShoppingRouter, CustomerRouter } = require('./Routes')
const cors = require('cors')
const path = require('path')

require('dotenv').config()
const port = process.env.PORT || 8100
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/images', express.static(path.join(__dirname,'..','images')))

app.use('/admin', adminRouter)
app.use('/vandor', VandorRouter)
app.use('/user', CustomerRouter)
app.use(ShoppingRouter)


app.use((err, req, res, next) => {
    let status = err.status;
    let message = err.message;
    if (!status) {
        status = 500;
        message = "Internal Server Error"
    }
    return res.status(status).json({ message })
})

app.listen(port, async () => {
    await connectDB()
    console.log(`Listening to PORT ${port}`);
})

