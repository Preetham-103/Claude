import React from "react";
import { Col, Dropdown, Row } from "react-bootstrap";

const BookFilters = ({
  categories,
  authors,
  priceRanges,
  onCategorySelect,
  onAuthorSelect,
  onPriceRangeSelect,
  getFilterLabel
}) => {
  return (
    <Row className="gap-3 p-3 flex-wrap">
      <Col xs="auto">
        <Dropdown onSelect={onCategorySelect}>
          <Dropdown.Toggle
            variant="secondary"
            id="dropdown-category"
            className="rounded-pill d-flex align-items-center gap-2 px-3"
            style={{ backgroundColor: "#2c2c2e", borderColor: "#2D1449" }}
          >
            {getFilterLabel("Category")}
          </Dropdown.Toggle>
          <Dropdown.Menu variant="dark">
            <Dropdown.Item eventKey="">All Categories</Dropdown.Item>
            {categories.map((cat) => (
              <Dropdown.Item key={cat.catId} eventKey={cat.catName}>
                {cat.catName}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Col>

      <Col xs="auto">
        <Dropdown onSelect={onAuthorSelect}>
          <Dropdown.Toggle
            variant="secondary"
            id="dropdown-author"
            className="rounded-pill d-flex align-items-center gap-2 px-3"
            style={{ backgroundColor: "#2c2c2e", borderColor: "#2D1449" }}
          >
            {getFilterLabel("Author")}
          </Dropdown.Toggle>
          <Dropdown.Menu variant="dark">
            <Dropdown.Item eventKey="">All Authors</Dropdown.Item>
            {authors.map((author) => (
              <Dropdown.Item key={author.authId} eventKey={author.authName}>
                {author.authName}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Col>

      <Col xs="auto">
        <Dropdown onSelect={onPriceRangeSelect}>
          <Dropdown.Toggle
            variant="secondary"
            id="dropdown-price"
            className="rounded-pill d-flex align-items-center gap-2 px-3"
            style={{ backgroundColor: "#2c2c2e", borderColor: "#2D1449" }}
          >
            {getFilterLabel("Price Range")}
          </Dropdown.Toggle>
          <Dropdown.Menu variant="dark">
            <Dropdown.Item eventKey="">All Price Ranges</Dropdown.Item>
            {priceRanges.map((range, index) => (
              <Dropdown.Item key={index} eventKey={index}>
                {range.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
  );
};

export default BookFilters;
