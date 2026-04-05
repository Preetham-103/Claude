import React, { useState, useEffect } from 'react';
import './ReviewCard.css';

import { getProfileById, getUserById } from '../../../services/review';

const ReviewCard = ({ review, onUpvote, onDownvote, onFlag, userId }) => {
  const getKey = (type) => `reaction_${userId}_${review.reviewId}_${type}`;
  const isVoted = (type) => !!localStorage.getItem(getKey(type));
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");

  useEffect(() => {
    const fetchName = async () => {
      try {
        const res = await getUserById(review.userId);
        const pro = await getProfileById(review.userId);
        setUserName(res.data.name);
        setUserImage(pro.data.imageBase64 || "");
      } catch (err) {
        console.error("Error fetching user name", err);
      }
    };
    fetchName();
  }, [review.userId]);

  const vote = (type, handler) => {
    if (!isVoted(type)) {
      handler();
      localStorage.setItem(getKey(type), 'true');
    }
  };

  const hasReacted = isVoted('upvote') || isVoted('downvote');


  return (
    <div className="review-card">
      <div className="review-header">
        {userImage ? (
          <img
            src={`data:image/jpeg;base64,${userImage}`}
            alt="avatar"
            className="user-avatar"
            onError={(e) => {
              console.error("inavalid image data")
            }}
          />
        ) : (
          <div className="user-avatar fallback">👤</div>
        )}
        <div>
          <strong> {userName}</strong>
          <small>{new Date(review.createdAt).toLocaleDateString()}</small>
        </div>
      </div>
      <div className="review-rating">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
      <p>{review.comment}</p>
      {/*       <div className="review-actions">
        <button type="radio" disabled={isVoted('upvote')} onClick={() => vote('upvote', onUpvote)}>👍 {review.upvotes}</button>
        <button type="radio" disabled={isVoted('downvote')} onClick={() => vote('downvote', onDownvote)}>👎 {review.downvotes}</button>
        <button disabled={isVoted('flag')} onClick={() => vote('flag', onFlag)}>🚩 {review.flags}</button>
      </div> */}
      <div className="review-actions">
        <label>
          <input
            type="radio"
            name={`reaction_${review.reviewId}`}
            checked={isVoted('upvote')}
            disabled={hasReacted}
            onChange={() => {
              if (!hasReacted) {
                onUpvote();
                localStorage.setItem(getKey('upvote'), 'true');
              }
            }}
          />
          👍 {review.upvotes}
        </label>

        <label>
          <input
            type="radio"
            name={`reaction_${review.reviewId}`}
            checked={isVoted('downvote')}
            disabled={hasReacted}
            onChange={() => {
              if (!hasReacted) {
                onDownvote();
                localStorage.setItem(getKey('downvote'), 'true');
              }
            }}
          />
          👎 {review.downvotes}
        </label>

        <button
          disabled={isVoted('flag')}
          onClick={() => vote('flag', onFlag)}
        >
          🚩 {review.flags}
        </button>
      </div>

    </div>
  );
};

export default ReviewCard;
