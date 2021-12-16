import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from 'react-bootstrap';
import Rating from '../components/Rating';
import {
  listProductDetails,
  createProductReview,
} from '../actions/productActions';
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_CREATE_REVIEW_RESET,
} from '../constants/productConstants';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import formatDate from '../utils/date-formatter';

const ProductScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // const [message, setMessage] = useState('');

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productCreateReview = useSelector((state) => state.productCreateReview);
  const {
    loading: loadingPrReview,
    error: errorPrReview,
    success: successPrReview,
  } = productCreateReview;

  useEffect(() => {
    if (successPrReview) {
      setRating(0);
      setComment('');
      // setMessage('Product successfully reviewed');
      dispatch({ type: PRODUCT_CREATE_RESET });
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(match.params.id));
  }, [dispatch, match, successPrReview]);

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProductReview(match.params.id, {
        rating,
        comment,
      })
    );
  };

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      {loading ? (
        <Loader top />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          {/* {message && <Message>{message}</Message>} */}
          <Meta title={product.name} />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={6}>
              <Row>
                <Col md={6}>
                  <ListGroup variant='flush'>
                    <ListGroup.Item>
                      <h3>{product.name}</h3>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Rating
                        value={product.rating}
                        text={`${product.numReviews} reviews`}
                      />
                    </ListGroup.Item>
                    <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                    <ListGroup.Item>
                      Description: {product.description}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={6}>
                  <Card>
                    <ListGroup variant='flush'>
                      <ListGroup.Item>
                        <Row>
                          <Col>Price:</Col>
                          <Col>
                            <strong>${product.price}</strong>
                          </Col>
                        </Row>
                      </ListGroup.Item>

                      <ListGroup.Item>
                        <Row>
                          <Col>Status:</Col>
                          <Col>
                            {product.countInStock > 0
                              ? `${product.countInStock} in Stock`
                              : 'Out of Stock'}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                      {product.countInStock > 0 && (
                        <ListGroup.Item>
                          <Row>
                            <Col>Qty</Col>
                            <Col>
                              <Form.Control
                                as='select'
                                value={qty}
                                onChange={(e) => setQty(e.target.value)}
                              >
                                {[...Array(product.countInStock).keys()].map(
                                  (x) => (
                                    <option key={x + 1} value={x + 1}>
                                      {x + 1}
                                    </option>
                                  )
                                )}
                              </Form.Control>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      )}
                      <ListGroup.Item style={{ display: 'grid' }}>
                        <Button
                          onClick={addToCartHandler}
                          disabled={product.countInStock === 0}
                          type='button'
                        >
                          Add To Cart
                        </Button>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card>
                </Col>
              </Row>
              <Row style={{ marginTop: '5%', marginLeft: '1%' }}>
                <Col>
                  <h2>Reviews</h2>
                  {product.reviews.length === 0 ? (
                    <Message>
                      Product has not been reviewed yet. Be the first one.
                    </Message>
                  ) : (
                    <ListGroup>
                      {product.reviews.map((review) => (
                        <ListGroup.Item key={review._id}>
                          <h5>{review.name}</h5>
                          <Rating value={review.rating} />
                          <p style={{ color: 'blue' }}>
                            {formatDate(review.createdAt, 'date')} at{' '}
                            {formatDate(review.createdAt, 'time')}
                          </p>
                          <p>{review.comment}</p>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                  <ListGroup>
                    <ListGroup.Item>
                      <h2>Write a Customer Review</h2>
                      {errorPrReview && (
                        <Message variant='danger'>{errorPrReview}</Message>
                      )}
                      {userInfo ? (
                        <Form onSubmit={submitHandler}>
                          <Form.Group controlId='rating'>
                            <Form.Label>Rating</Form.Label>
                            <Form.Control
                              as='select'
                              value={rating}
                              onChange={(e) => setRating(e.target.value)}
                            >
                              <option value=''>Select...</option>
                              <option value='1'>1 - Poor</option>
                              <option value='2'>2 - Fair</option>
                              <option value='3'>3 - Good</option>
                              <option value='4'>4 - Very Good</option>
                              <option value='5'>5 - Excellent</option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group controlId='comment'>
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                              as='textarea'
                              row='3'
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            ></Form.Control>
                          </Form.Group>
                          <Button
                            type='submit'
                            variant='primary'
                            className='my-2'
                          >
                            {loadingPrReview ? (
                              <span>
                                <i className='fas fa-spinner fa-spin' />{' '}
                                Submitting ...
                              </span>
                            ) : (
                              <span>
                                <i className='fas fa-upload' /> Submit
                              </span>
                            )}
                          </Button>
                        </Form>
                      ) : (
                        <Message>
                          <Link to='/login'>Sign in</Link> to write a review
                        </Message>
                      )}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
