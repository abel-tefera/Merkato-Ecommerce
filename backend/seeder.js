// import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
// import products from './data/products.js';
// import newProducts from './data/newProducts.js';
// import adidas from './data/adidas.js';
import ebay from './data/ebay.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();
function between(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    // const sampleProducts = products.map((product) => {
    //   return {
    //     ...product,
    //     user: adminUser,
    //   };
    // });

    const sampleProducts = ebay.map((product) => {
      return {
        name: product.name ? product.name : 'ebay',
        image:
          product.images && product.images !== ''
            ? product.images.split('~')[0]
            : '/uploads/nature.jpg',
        description: product.breadcrumbs ? product.breadcrumbs : 'ebay',
        brand: product.brand ? product.brand : 'ebay',
        category: product.brand ? product.brand : 'ebay',
        price:
          product.price !== ''
            ? Number(product.price)
            : (between(1, 100) * Math.random()).toFixed(2),
        countInStock: product.in_stock === 'True' ? between(1, 25) : 0,
        rating: 0,
        numReviews: 0,
        user: adminUser,
      };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
