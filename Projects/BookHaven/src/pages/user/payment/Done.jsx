import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1); /* Enlarge */
  }
  100% {
    transform: scale(1); /* Shrink back to normal */
  }
`;

const drawTickPathAnimation = keyframes`
  0% {
    height: 0; /* Tick starts with no height */
    border-width: 0; /* And no borders */
  }
  25% {
    height: 0; /* Still no height */
    border-width: 0 0 0.12em 0.12em; /* Start showing the first part of the tick (bottom-left leg) */
  }
  50% {
    height: 0.6em; /* Grow the height of the first leg */
    border-width: 0 0 0.12em 0.12em; /* Still showing just the first leg, but now full length */
  }
  75% {
    height: 0.6em; /* Keep height, now start forming the second leg */
    border-width: 0 0.12em 0.12em 0.12em; /* Add the right border to create the corner and second leg */
  }
  100% {
    height: 0.6em; /* Full height */
    border-width: 0 0.12em 0.12em 0; /* Final tick state */
  }
`;

// Fade-in animation for the text
const fadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// New: Fade-out animation for both the tick/circle and text
const fadeOutAnimation = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    visibility: hidden; /* Hide element completely after fade */
  }
`;

// --- Animation Timing Constants ---
const TICK_DRAW_DURATION = 1; // seconds
const TEXT_FADE_IN_DELAY = TICK_DRAW_DURATION + 0.2; // 0.2s buffer after tick draws
const TEXT_FADE_IN_DURATION = 0.5; // seconds
const WAIT_BEFORE_FADE_OUT = 3; // seconds

const FADE_OUT_DELAY = TEXT_FADE_IN_DELAY + TEXT_FADE_IN_DURATION + WAIT_BEFORE_FADE_OUT; // Total delay before fade out starts
const FADE_OUT_DURATION = 0.5; // seconds

const Done = () => {
  return (
    <StyledWrapper>
      <div className="checkbox-wrapper">
        <label className="container">
          <input type="checkbox" />
          <div className="checkmark" />
        </label>
      </div>
      <div className="status-text">
        Payment Successful
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  background-color: #212529;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .checkbox-wrapper {
    animation: ${pulseAnimation} 2s ease-in-out infinite,
               ${fadeOutAnimation} ${FADE_OUT_DURATION}s ease-out ${FADE_OUT_DELAY}s forwards; /* Added fade-out */
  }

  .checkbox-wrapper *,
  .checkbox-wrapper ::after,
  .checkbox-wrapper ::before {
    box-sizing: border-box;
  }

  .checkbox-wrapper .container input {
    opacity: 1;
    -webkit-appearance: none;
    cursor: default;

    height: 100px;
    width: 100px;

    background: linear-gradient(to bottom right, #007BFF, #0056b3);
    border: none;

    box-shadow: -10px -10px 15px rgba(255,255,255,0.05),
      10px 10px 15px rgba(0,0,0,0.5);
    border-radius: 50%;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: .5s;
  }

  .checkbox-wrapper .container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .checkbox-wrapper .container input::after {
    font-size: 85px;
    left: 0.35em;
    top: 0.05em;

    font-family: monospace;
    content: '';
    color: #7a7a7a; 
    
    width: 0.25em; 
    height: 0.6em;
    
    border: solid #28A745;
    border-width: 0 0.12em 0.12em 0;
    transform: rotate(45deg);
    
    animation: ${drawTickPathAnimation} ${TICK_DRAW_DURATION}s ease-out forwards; 
    transition: none; 
    
    border-width: 0;
    height: 0;
  }

  .status-text {
    color: #E0E0E0;
    font-family: 'Arial', sans-serif;
    font-size: 24px;
    margin-top: 30px;
    letter-spacing: 1px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
    
    opacity: 0;
    animation: ${fadeInAnimation} ${TEXT_FADE_IN_DURATION}s ease-out forwards, /* Fade-in */
               ${fadeOutAnimation} ${FADE_OUT_DURATION}s ease-out ${FADE_OUT_DELAY}s forwards; /* Added fade-out */
  }
`;

export default Done;