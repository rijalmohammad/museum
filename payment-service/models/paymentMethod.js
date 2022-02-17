const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentMethodSchema = new Schema({
    name: String,
})

const PaymentMethod = mongoose.model('payment-method', paymentMethodSchema);

module.exports = PaymentMethod;