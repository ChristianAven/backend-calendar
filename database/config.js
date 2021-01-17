const mongoose = require('mongoose');

const dbConnetion = async() => {

    try {
        await mongoose.connect(process.env.DB_CNN, 
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('DB_CNN Online');

    } catch (error) {
        console.log(error);
        throw new Error("Error a la hora de inicializar la base de datos");
    }

}

module.exports = dbConnetion;