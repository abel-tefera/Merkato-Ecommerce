import React, { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  listProducts,
  deleteProduct,
  createProduct,
} from '../actions/productActions';
import {
  PRODUCT_LIST_RESET,
  PRODUCT_CREATE_RESET,
  PRODUCT_DELETE_RESET
} from '../constants/productConstants';

const ProductListScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const [del, setDel] = useState('0');

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDel,
    error: errorDel,
    success: successDel,
  } = productDelete;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productCreate = useSelector((state) => state.productCreate);

  const {
    success: successCreate,
    loading: loadingCreate,
    error: errorCreate,
    product: createdProduct,
  } = productCreate;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login');
    }
    if (successCreate) {
      dispatch({ type: PRODUCT_LIST_RESET });
      history.push(`/admin/product/${createdProduct._id}/edit`);
    } else {
      if (successDel) {
        dispatch({ type: PRODUCT_LIST_RESET });
        dispatch({type: PRODUCT_DELETE_RESET});
      }
      dispatch(listProducts());
    }
  }, [dispatch, history, userInfo, successDel, successCreate, createdProduct]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      setDel(id);
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col style={{ textAlign: '-webkit-right' }}>
          <Button
            className='my-3'
            onClick={createProductHandler}
            disabled={loadingCreate}
          >
            {!loadingCreate ? (
              <span>
                <i className='fas fa-plus' /> Create Product{' '}
              </span>
            ) : (
              <span>
                <i className='fas fa-spinner fa-spin' /> Creating Product...
              </span>
            )}
          </Button>
        </Col>
      </Row>
      {errorDel && <Message variant='danger'>{errorDel}</Message>}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}

      {loading ? (
        <Loader top/>
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead style={{ verticalAlign: 'middle' }}>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th></th>
            </tr>
          </thead>
          <tbody style={{ verticalAlign: 'middle' }}>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td
                  style={{
                    textAlign: '-webkit-center',
                    padding: '0',
                    placeContent: 'center',
                  }}
                  className='d-flex'
                >
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant='light' className='btn-sm'>
                      <i className='fas fa-edit' />
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(product._id)}
                    disabled={loadingDel && del === product._id}
                  >
                    {loadingDel && del === product._id ? (
                      <i className='fas fa-spinner fa-spin' />
                    ) : (
                      <i className='fas fa-trash' />
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default ProductListScreen;
