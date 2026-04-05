import React from "react";
import { Col, Nav, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";

const BookPagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Row className="justify-content-center p-4">
      <Col xs="auto">
        <Nav>
          <Nav.Link
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="text-white rounded-pill"
          >
            <FontAwesomeIcon icon={faCaretLeft} />
          </Nav.Link>
          {[...Array(totalPages)].map((_, index) => (
            <Nav.Link
              key={index}
              onClick={() => onPageChange(index + 1)}
              className={`text-white rounded-pill ${currentPage === index + 1 ? "bg-secondary" : ""
                }`}
            >
              {index + 1}
            </Nav.Link>
          ))}
          <Nav.Link
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="text-white rounded-pill"
          >
            <FontAwesomeIcon icon={faCaretRight} />
          </Nav.Link>
        </Nav>
      </Col>
    </Row>
  );
};

export default BookPagination;
