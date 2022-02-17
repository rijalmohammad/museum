const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    bookingId: String,
    amount: Number,
    status: String,
})

const Payment = mongoose.model('payment', paymentSchema);

module.exports = Payment;