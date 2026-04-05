import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById } from '../../../services/bookService';
import { addReview, getReviewsByBook, upvoteReview, downvoteReview, flagReview } from '../../../services/review';
import { addToCart, increaseQuantity, decreaseQuantity } from '../../../services/cart';
import ReviewCard from './ReviewCard';
import './BookDetails.css';
import EventEmitter from '../../../utils/cartEvents'

const BookDetails = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.userId;
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [sortOption, setSortOption] = useState('newest');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    getBookById(bookId).then(res => setBook(res.data));
    getReviewsByBook(bookId).then(res => setReviews(res.data));
  }, [bookId]);

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOption === 'highest') return b.rating - a.rating;
    if (sortOption === 'lowest') return a.rating - b.rating;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const updateReview = (reviewId, field) => {
    setReviews(prev =>
      prev.map(r =>
        r.reviewId === reviewId ? { ...r, [field]: r[field] + 1 } : r
      )
    );
  };

  const handleAddToCart = async () => {
    if (!userId) return alert("Login required!");
    if (!book || book.stockQuantity <= 0) return alert("Book out of stock!");
    setAdding(true);
    try {
      const response = await addToCart(userId, bookId, { quantity: 1 });
      if (response.status === 200) {
        setQuantity(1);
        alert("Added to cart!");

        if (response.data && response.data.cartItems) { 
        EventEmitter.emit('cartUpdated', response.data.cartItems  );
      } else {
        EventEmitter.emit('cartUpdated'); // Emit without data to signal a refresh
      }

      }

    } catch (error) {
      alert("Error adding to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleIncrease = async () => {
    await increaseQuantity(userId, bookId, 1);
    setQuantity(prev => prev + 1);
  };

  const handleDecrease = async () => {
    if (quantity > 1) {
      await decreaseQuantity(userId, bookId, 1);
      setQuantity(prev => prev - 1);
    } else {
      setQuantity(0);
    }
  };



  const [showReviewModal, setShowReviewModal] = useState(false);
  const handleAddReview = () => {
    if (!userId) return alert("Login required!");
    setShowReviewModal(true);
  };


  const [form, setForm] = useState({
    rating: 0,
    comment: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isReviewDeleted: false
  });

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!form.rating || !form.comment) return alert("Please complete the form.");

    try {
      const res = await addReview(userId, bookId, form);
      if (res.status === 200) {
        alert("Review added!");
        setShowReviewModal(false);
        getReviewsByBook(bookId).then(res => setReviews(res.data));
      } else {
        alert("You already reviewed this book.");
      }
    } catch (err) {
      alert("Error submitting review");
    }
  };


  if (!book) return <div className="loading">Loading book...</div>;

  return (
    <div className='book-details-main'>
      <div className="book-details-container">
      <div className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </div>
        <div className="bookcard">
          <img src={`data:image/jpeg;base64,${book.imageBase64}`} alt={book.title} className="book-img" />
          <div className="book-info">
            <h2>{book.title}</h2>
            <p className="author">By {book.author?.authName}</p>
            <p className="category">{book.category?.catName}</p>
            <p className="description">{book.description}</p>
            <p><strong>Price:</strong> ₹{book.price}</p>
            <div className="book-action-buttons">
              {quantity > 0 ? (
                <>
                  <button className='increase-button' onClick={handleDecrease}>−</button>
                  <span>{quantity}</span>
                  <button className="increase-button" onClick={handleIncrease}>+</button>
                </>
              ) : (
                <button onClick={handleAddToCart} disabled={adding}>
                  {adding ? "Adding..." : "Add to Cart"}
                </button>
              )}
              <button onClick={handleAddReview}>Write a Review</button>
            </div>
          </div>
        </div>

        <div className="reviews-summary">
          <h3>Customer Reviews</h3>
          {averageRating && <div className="average-rating">{averageRating} ★</div>}
          {reviews.length > 0 && (
            <>
              {[5, 4, 3, 2, 1].map(star => {
                const count = reviews.filter(r => r.rating === star).length;
                const percent = ((count / reviews.length) * 100).toFixed(0);
                return (
                  <div key={star} className="review-bar">
                    <span>{star}</span>
                    <div className="bar"><div style={{ width: `${percent}%` }} /></div>
                    <span>{percent}%</span>
                  </div>
                );
              })}
            </>
          )}
          <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>

        <div className="reviews-list">
          {sortedReviews.map(r => (
            <ReviewCard
              key={r.reviewId}
              review={r}
              userId={userId}
              onUpvote={() => upvoteReview(r.reviewId).then(() => updateReview(r.reviewId, 'upvotes'))}
              onDownvote={() => downvoteReview(r.reviewId).then(() => updateReview(r.reviewId, 'downvotes'))}
              onFlag={() => flagReview(r.reviewId).then(() => updateReview(r.reviewId, 'flags'))}
            />
          ))}
        </div>
        {showReviewModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Write a Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <label>Rating (1–5)</label>
                <input
                  type="number"
                  name="rating"
                  value={form.rating}
                  onChange={handleFormChange}
                  min={1}
                  max={5}
                  required
                />
                <label>Comment</label>
                <textarea
                  name="comment"
                  value={form.comment}
                  onChange={handleFormChange}
                  required
                />
                <div className="modal-actions">
                  <button type="submit">Submit</button>
                  <button type="button" onClick={() => setShowReviewModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default BookDetails;
