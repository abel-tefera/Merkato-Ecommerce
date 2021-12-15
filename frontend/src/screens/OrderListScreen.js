import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listOrders } from '../actions/orderActions';
import formatDate from '../utils/date-formatter';
import { ORDER_DETAILS_RESET } from '../constants/orderConstants';

const OrderListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
      dispatch({ type: ORDER_DETAILS_RESET });
    } else {
      history.push('/login');
    }
  }, [dispatch, history, userInfo]);

  return (
    <>
      <h1>Orders</h1>
      {loading ? (
        <Loader top/>
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead style={{ verticalAlign: 'middle' }}>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody style={{ verticalAlign: 'middle' }}>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>
                  {formatDate(order.createdAt, 'date')} at{' '}
                  {formatDate(order.createdAt, 'time')}
                </td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    <span>
                      {formatDate(order.paidAt, 'date')} at{' '}
                      {formatDate(order.paidAt, 'time')}
                    </span>
                  ) : (
                    <div style={{ textAlign: '-webkit-center' }}>
                      <i className='fas fa-times' style={{ color: 'red' }} />
                    </div>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <span>
                      {formatDate(order.deliveredAt, 'date')} at{' '}
                      {formatDate(order.deliveredAt, 'time')}
                    </span>
                  ) : (
                    <div style={{ textAlign: '-webkit-center' }}>
                      <i className='fas fa-times' style={{ color: 'red' }} />
                    </div>
                  )}
                </td>
                <td style={{ textAlign: '-webkit-center' }}>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant='light' className='btn-sm'>
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
