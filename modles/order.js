const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderSchema = new Schema({
    products: [{
        product: { type: Object, required: true },
        quantity: { type: Number, required: true }
    }],
    user: {
        email: {
            type: String,
            required: true
        },
        userId: {
            required: true,
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }
})
module.exports = mongoose.model('Order', orderSchema);