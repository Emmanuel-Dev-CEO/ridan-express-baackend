const mongoose = require('mongoose');

module.exports.dbConnect = async () => {
    try {
        if (process.env.mode === 'pro') {
            await mongoose.connect(process.env.DB_PRO_URL, { useNewURLParser: true })
         console.log("production database is connected")
        }
        else {
            await mongoose.connect(process.env.DB_LOCAL_URL, { useNewURLParser: true })
            console.log("local database is connected")
        }
    } catch (error) {
        console.log(error.message)
    }
}