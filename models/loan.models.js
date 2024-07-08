const mongoose = require('mongoose');
const User = require("../models/user.models").User;
const Ceiit = require("../models/ceiit.models").Ceiit;

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
        default: Date.now,
    },
    nameObj: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ceiit',
        require: true
    },
    status: {
        type: Boolean,
        default: true, // Se establece en true por defecto
        require: true
    },
    linkOpenLoan: {
        type: String
    },
    linkCloseLoan: {
        type: String
    }
});

const Loan = mongoose.model('Loan', loanSchema);

module.exports = {
    Loan
};
