import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173"; // Your frontend URL

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      amount: item.price * 100 * 80,
      currency: "INR",
      name: item.name,
      quantity: item.quantity,
    }));

    line_items.push({
      amount: 2 * 100 * 80, // Delivery charges
      currency: "INR",
      name: "Delivery charges",
      quantity: 1,
    });

    const options = {
      amount: req.body.amount * 100 * 80, // amount in paisa
      currency: "INR",
      receipt: newOrder._id.toString(),
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });
  } catch (error) {
    console.log("Error occurred during Razorpay order creation:", error);
    res.json({ success: false, message: error.message || "Error while placing the order" });
  }
};

export { placeOrder };
