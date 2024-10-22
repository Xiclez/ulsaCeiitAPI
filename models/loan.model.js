const mongoose = require('mongoose');
const User = require("./user.model").User;
const Ceiit = require("./object.model").Ceiit;

const loanSchema = new mongoose.Schema({
    nameUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    date: {
        type: Date,
        default: Date.now,
        require: true
    },
    returnDate: {
        type: Date,
        require: true
    },
    actualReturnDate: {
        type: Date,
        default: null
    },
    nameObj: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Objeto',
        require: true
    },
    status: {
        type: Boolean,
        default: true, 
        require: true
    },
    observaciones: {
        type: String,
        default: 'Sin observaciones'
    }
});

const Loan = mongoose.model('Loan', loanSchema);

module.exports = {
    Loan
};
