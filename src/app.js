const express = require('express')
const { connectDB } = require('./config/db.config')

require('dotenv').config()
const port = process.env.PORT || 8100
const app = express()

app.listen(port, async () => {
    await connectDB()
    console.log(`Listening to PORT ${port}`);
})

