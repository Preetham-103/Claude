import React from "react";
import StyledWrapper from "./StyledWtapper";

const BookSortOptions = ({ sortOption, onSortChange }) => {
  const getSliderPosition = () => {
    if (sortOption === "Relevance") return "0%";
    if (sortOption === "Price: Low to High") return "33.33%";
    if (sortOption === "Price: High to Low") return "66.66%";
    return "0%";
  };

  return (
    <StyledWrapper>
      <h3 className="sort-title">Sort By</h3>
      <div className="mydict">
        <div>
          <div
            className="slider"
            style={{
              left: getSliderPosition(),
            }}
          />
          <label>
            <input
              type="radio"
              name="sortOption"
              value="Relevance"
              checked={sortOption === "Relevance"}
              onChange={onSortChange}
            />
            <span>Relevance</span>
          </label>
          <label>
            <input
              type="radio"
              name="sortOption"
              value="Price: Low to High"
              checked={sortOption === "Price: Low to High"}
              onChange={onSortChange}
            />
            <span>Price: Low to High</span>
          </label>
          <label>
            <input
              type="radio"
              name="sortOption"
              value="Price: High to Low"
              checked={sortOption === "Price: High to Low"}
              onChange={onSortChange}
            />
            <span>Price: High to Low</span>
          </label>
        </div>
      </div>
    </StyledWrapper>
  );
};

export default BookSortOptions;
