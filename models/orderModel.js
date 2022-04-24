const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = mongoose.Schema(
  {
    orderOwner: {
      type: Schema.Types.ObjectId,
      ref: "userModel",
      require: true,
    },
    cart: {
      type: Object,
      require: true,
    },
    status: {
      type: String,
      default: 0,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },

    paymentId: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("orderModel", orderSchema);
