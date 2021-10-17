const {connect} = require('mongoose')
const connectDB = async () => {
    const {MONGODB_URI} = process.env
    // console.log(MONGODB_URI)
    const db =  await connect(MONGODB_URI)
    console.log(`MongoDB is conected ${db.connection.name}, CLASTER_NAME: ${db.connection.host}`)
    // console.log(db)
}

module.exports = connectDB
