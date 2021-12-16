// import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
// import products from './data/products.js';
import newProducts from './data/newProducts.js';

import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/userModel.js';
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

    const sampleProducts = newProducts.map((product) => {
      return {
        name: product.name,
        image: product.images,
        description: product.breadcrumbs,
        brand: product.brand,
        category: product.brand,
        price: (product.price * (Math.random() + between(0, 5))).toFixed(2),
        countInStock: product.availability == 'InStock' ? between(1, 25) : 0,
        rating: (Math.random() * 4).toFixed(2),
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
