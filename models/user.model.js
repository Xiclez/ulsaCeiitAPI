const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    tuition:{
        type: Number,
        require: true 
    },
    name:{
        type: String,
        require: true
    },
    surName:{
        type: String,
        require: true
    },
    role:{ 
	type: String,
        enum: ['Administrador', 'Desarrollador', 'Usuario'], 
	default: 'Usuario' 
    },
    codigoQR: {
        type: String,
        require: true
    }
}, {collection:'user'});

const User =  mongoose.model('User', userSchema);

module.exports = {
    User
};
