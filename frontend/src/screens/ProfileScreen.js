import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { LinkContainer } from 'react-router-bootstrap';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';
import formatDate from '../utils/date-formatter';

const ProfileScreen = ({ history }) => {
  const [name, setName] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loadingBtn, loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderMyList = useSelector((state) => state.orderMyList);
  const { loading: loadingOrders, error: errorOrders, orders } = orderMyList;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      if (!user.name) {
        dispatch(getUserDetails('profile'));
        dispatch(listMyOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [history, userInfo, dispatch, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
    }
  };
  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <Row>
          <Col md={3}>
            <h2>User Profile</h2>
            {error && <Message variant='danger'>{error}</Message>}
            {success && <Message variant='success'>Profile Updated</Message>}
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='name'
                  placeholder='Enter name...'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId='email'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Enter email...'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Enter password...'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId='ConfirmPassword'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Confirm Password...'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>
              {message && <Message variant='danger'>{message}</Message>}
              <Button
                type='submit'
                variant='primary'
                disabled={loadingBtn}
                className='my-2'
              >
                {loadingBtn ? 'Loading…' : 'Update'}
              </Button>
            </Form>
          </Col>
          <Col md={9}>
            <h2>My Orders</h2>
            {loadingOrders ? (
              <Loader />
            ) : errorOrders ? (
              <Message variant='danger'>{errorOrders}</Message>
            ) : (
              <Table striped bordered hover responsive className='table-sm'>
                <thead style={{verticalAlign: 'middle'}}>
                  <tr>
                    <th>ID</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody style={{verticalAlign: 'middle'}}>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>
                        {formatDate(order.createdAt, 'date')} at{' '}
                        {formatDate(order.createdAt, 'time')}
                      </td>
                      <td>${order.totalPrice}</td>
                      <td style={{textAlign: '-webkit-center'}}>
                        {order.isPaid ? (
                          <span>
                            {formatDate(order.paidAt, 'date')} at{' '}
                            {formatDate(order.paidAt, 'time')}
                          </span>
                        ) : (
                          <span>
                            <i
                              className='fas fa-times'
                              style={{ color: 'red' }}
                            />
                          </span>
                        )}
                      </td>
                      <td style={{textAlign: '-webkit-center'}}>
                        {order.isDelivered ? (
                          <span>
                            {formatDate(order.deliveredAt, 'date')} at{' '}
                            {formatDate(order.deliveredAt, 'time')}
                          </span>
                        ) : (
                          <span>
                            <i
                              className='fas fa-times '
                              style={{ color: 'red' }}
                            />
                          </span>
                        )}
                      </td>
                      <td>
                        <LinkContainer to={`/order/${order._id}`}>
                          <Button className='btn-sm' variant='light'>
                            Details
                          </Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProfileScreen;
