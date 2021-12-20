import axios from 'axios';
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_SET_FROM_DB,
  CART_LOADING,
  CART_GET_FAIL,
} from '../constants/cartConstants';

export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`);

  const {
    userLogin: { userInfo },
    cart: { cartItems },
  } = getState();

  const newItem = {
    product: data._id,
    name: data.name,
    image: data.image,
    price: data.price,
    countInStock: data.countInStock,
    qty,
  };

  dispatch({
    type: CART_ADD_ITEM,
    payload: newItem,
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));

  if (userInfo) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    let items = [];
    const existItem = cartItems.find(
      (item) => item.product === newItem.product
    );
    if (existItem) {
      [...cartItems].forEach((cartItem) => {
        if (cartItem.product === newItem.product) {
          items.push({
            product: cartItem.product,
            qty: newItem.qty,
          });
        } else {
          items.push({
            product: cartItem.product,
            qty: cartItem.qty,
          });
        }
      });
    } else {
      [...cartItems, newItem].forEach((cartItem) => {
        items.push({
          product: cartItem.product,
          qty: cartItem.qty,
        });
      });
    }

    try {
      await axios.put('/api/cart', { items }, config);
    } catch (error) {
      dispatch({
        type: CART_GET_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
};

export const removeFromCart = (id) => async (dispatch, getState) => {
  dispatch({ type: CART_REMOVE_ITEM, payload: id });

  const {
    userLogin: { userInfo },
    cart: { cartItems },
  } = getState();

  let items = cartItems.filter((item) => item.product !== id);

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));

  if (userInfo) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    try {
      await axios.put('/api/cart', { items }, config);
    } catch (error) {
      dispatch({
        type: CART_GET_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
};

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({ type: CART_SAVE_SHIPPING_ADDRESS, payload: data });
  localStorage.setItem('shippingAddress', JSON.stringify(data));
};

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({ type: CART_SAVE_PAYMENT_METHOD, payload: data });
  localStorage.setItem('paymentMethod', JSON.stringify(data));
};

export const getCart = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: CART_LOADING,
    });

    const {
      userLogin: { userInfo },
      // cart: { cartItems },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get('/api/cart', config);

    // if (cartItems && cartItems.length > 0) {

    // let cartList = [];

    //   cartList = data[0].items.map((item) => {
    //    if(cartItems.some(cartItem => cartItem.product === item.product._id)){
    //     return {
    //       product: {
    //         countInStock: item.product.countInStock,
    //         image: item.product.image,
    //         name: item.product.name,
    //         price: item.product.price,
    //         _id: item.product.price,
    //       },
    //       qty: item.qty,
    //     };
    //    } else {

    //    }
    //   cartList = data[0].items.map((item) => {
    //     return cartItems.forEach((cartItem) => {
    //       if (item.product._id === cartItem.product) {

    //       } else {
    //         return {};
    //       }
    //     });
    //   });
    // }

    // console.log(cartList);

    dispatch({
      type: CART_SET_FROM_DB,
      payload: data[0].items,
    });
  } catch (error) {
    dispatch({
      type: CART_GET_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
