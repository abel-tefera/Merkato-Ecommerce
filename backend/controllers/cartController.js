import asyncHandler from 'express-async-handler';
import Cart from '../models/cartModel.js';

// @desc    Get logged in user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.find({ user: req.user._id }).populate(
    'items.product',
    'name countInStock image price qty'
  );
  if (cart) {
    res.json(cart);
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

// @desc    Create the cart
// @route   PUT /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { items } = req.body;
  const cart = await Cart.findOne({
    user: req.user._id,
  });
  if (cart) {
    if (items && items.length > 0) {
      cart.items = items;
    } else {
      cart.items = [];
    }
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

export { getCart, addToCart };
