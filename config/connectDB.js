const mongoose = require("mongoose");

const connectDB = async (url) => {
    mongoose.set('strictQuery', false)
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Database Connected Successfully'); 
    })
    .catch(e => {
      console.log(e)
    })
};

module.exports = connectDB;