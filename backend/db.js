const mongoose = require('mongoose');
const mongoURI = 'mongodb://127.0.0.1:27017/inotebook';

const connectToMongo = () => {
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(console.log("connected to mongodb"))
        .catch((err) => {
            console.log(err);
        })
}

module.exports = connectToMongo;