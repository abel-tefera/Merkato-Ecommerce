import React, { useState, useEffect } from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  const [usePage, setUsePage] = useState([]);

  useEffect(() => {
    if (pages && pages > 1) {
      if (page - 5 > 0 && pages - page > 5) {
        setUsePage([...Array(pages).keys()].slice(page - 6, page + 5));
      } else if (page <= 5) {
        setUsePage([...Array(pages).keys()].slice(0, page + 9));
      } else if (page >= pages - 5) {
        setUsePage([...Array(pages).keys()].slice(page - 6, pages));
      }
    }
  }, [page, pages]);

  return (
    usePage.length > 1 && (
      <Pagination style={{ justifyContent: 'center' }}>
        <LinkContainer
          to={
            !isAdmin
              ? keyword
                ? `/search/${keyword}/page/1`
                : `/page/1`
              : `/admin/productlist/1`
          }
        >
          <Pagination.First />
        </LinkContainer>

        {page !== 1 && (
          <LinkContainer
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${page - 1}`
                  : `/page/${page - 1}`
                : `/admin/productlist/${page - 1}`
            }
          >
            <Pagination.Prev />
          </LinkContainer>
        )}

        {/* <Pagination.Ellipsis /> */}

        {usePage.map((x) => (
          <LinkContainer
            key={x + 1}
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${x + 1}`
                  : `/page/${x + 1}`
                : `/admin/productlist/${x + 1}`
            }
          >
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
        {/* <Pagination.Ellipsis /> */}
        {page !== pages && (
          <LinkContainer
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${page + 1}`
                  : `/page/${page + 1}`
                : `/admin/productlist/${page + 1}`
            }
          >
            <Pagination.Next />
          </LinkContainer>
        )}

        <LinkContainer
          to={
            !isAdmin
              ? keyword
                ? `/search/${keyword}/page/${pages}`
                : `/page/${pages}`
              : `/admin/productlist/${pages}`
          }
        >
          <Pagination.Last />
        </LinkContainer>
      </Pagination>
    )
  );
};

export default Paginate;
