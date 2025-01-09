import userModel from "../models/userModel.js";

// Add items to user cart
const addToCart = async (req, res) => {
    try {
        // Retrieve the user's data using the userId set by authMiddleware
        let userData = await userModel.findById(req.body.userId);

        // Initialize cartData if it's undefined
        let cartData = userData.cartData;

        // Add or increment the item in the cart
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1; // Add item with quantity 1
        } else {
            cartData[req.body.itemId] += 1; // Increment item quantity
        }

        // Update the user's cart in the database
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });

        res.json({ success: true, message: "Added to cart" });
    } catch (error) {
        console.error("Error in addToCart:", error);
        res.status(500).json({ success: false, message: "Error adding to cart" });
    }
};

// Remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData;

        // Check if the item exists in the cart
        if (cartData[req.body.itemId]>0) {
            cartData[req.body.itemId] -= 1;

            await userModel.findByIdAndUpdate(req.body.userId, { cartData });
            res.json({ success: true, message: "Item removed from cart" });
        } else {
            res.status(404).json({ success: false, message: "Item not found in cart" });
        }
    } catch (error) {
        console.error("Error in removeFromCart:", error);
        res.status(500).json({ success: false, message: "Error removing from cart" });
    }
};

// Fetch user cart data
const getCart = async (req, res) => {
    try {
        let userData=await userModel.findById(req.body.userId);
        let cartData=await userData.cartData;

        res.json({success:true,cartData})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
    }

   
};




export { addToCart, removeFromCart, getCart };
