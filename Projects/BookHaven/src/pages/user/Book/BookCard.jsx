import React from "react";
import StyledWrapper from "./StyledWtapper";
import { useNavigate } from "react-router-dom";

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  return (
    <div className="shadow-card d-flex flex-column gap-4 pb-3">
      <img
        src={
          book.imageBase64
            ? `data:image/png;base64,${book.imageBase64}`
            : book.imageUrl || "https://placehold.co/150x150"
        }
        alt={book.title}
        className="w-100 rounded-xl"
        style={{
          objectFit: "cover",
          height: "auto",
          aspectRatio: "3 / 4",
        }}
      />
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        <div className="book-details">
          <p className="text-white fs-6 fw-medium mb-0">{book.title}</p>
          <p className="text-secondary fs-6">
            {typeof book.author === "object"
              ? book.author.authName
              : book.authorName || book.author}
          </p>
          {book.price && (
            <p className="text-white fs-6 fw-bold">₹{book.price}</p>
          )}
          <StyledWrapper>
            <button
              className="boton-elegante"
              onClick={() => navigate(`/user/book/${book.bookId}`)}
            >
              View Book
            </button>
          </StyledWrapper>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
