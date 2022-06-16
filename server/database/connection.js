const mongoose = require("mongoose"); 

const connectDB = async() => {
    try{
        //mongodb connection string
        await mongoose.connect(process.env.MONGO_URL, () => {
		{useNewUrlParser: true};
            console.log(
                `Connected to Mongo database!`,
            );
        })
        .catch(err => {
            console.error('Error connecting to mongo', err);
        });
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB
