const mongoose = require('mongoose');

const objSchema = new mongoose.Schema({
    NOMBRE: {
        type: String,
        require: true
    },
    Lugar: {
        type: String,
        require: true
    },
    isAvailable:{
        type : Boolean,
        default: true,
        require: true 
    },
     imgURL:{
	type: String,
	require: true
   }    
}, {collection:'ceiit'});

const Ceiit =  mongoose.model('Ceiit', objSchema);

module.exports = {
    Ceiit
};
