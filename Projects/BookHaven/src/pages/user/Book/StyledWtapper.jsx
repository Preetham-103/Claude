import styled from "styled-components";

const StyledWrapper = styled.div`
  // For toggle button
  .sort-title {
    color: white;
    font-size: 1.25rem;
    font-weight: bold;
    padding: 1rem 1rem 0.5rem 1rem;
  }

  .mydict {
    display: flex;
    justify-content: center;
    padding: 1rem;

    div {
      position: relative;
      display: flex;
      background-color: #1c1c1e;
      border-radius: 999px;
      padding: 0.2rem;
      width: 100%;
      max-width: 1200px;
      height: 36px;
    }

    label {
      flex: 1;
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.2rem 0.5rem;
      border-radius: 999px;
      color: #8e8e93;
      font-weight: 500;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    input[type="radio"] {
      display: none;
    }

    input[type="radio"]:checked + span {
      color: #ffffff;
    }

    .slider {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 33.33%;
      background-color: #2c2c2e;
      border-radius: 999px;
      transition: left 0.3s ease;
      z-index: 1;
    }

    span {
      width: 100%;
      text-align: center;
      z-index: 2;
    }
  }

  // For "Loading"
  .loader {
    width: 80px;
    height: 50px;
    position: relative;
  }
  .loader-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh; /* Adjust as needed */
  }

  .loader-text {
    position: absolute;
    top: 0;
    padding: 0;
    margin: 0;
    color: #c8b6ff;
    animation: text_713 3.5s ease both infinite;
    font-size: 0.8rem;
    letter-spacing: 1px;
  }

  .load {
    background-color: #9a79ff;
    border-radius: 50px;
    display: block;
    height: 16px;
    width: 16px;
    bottom: 0;
    position: absolute;
    transform: translateX(64px);
    animation: loading_713 3.5s ease both infinite;
  }

  .load::before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background-color: #d1c2ff;
    border-radius: inherit;
    animation: loading2_713 3.5s ease both infinite;
  }

  @keyframes text_713 {
    0% {
      letter-spacing: 1px;
      transform: translateX(0px);
    }

    40% {
      letter-spacing: 2px;
      transform: translateX(26px);
    }

    80% {
      letter-spacing: 1px;
      transform: translateX(32px);
    }

    90% {
      letter-spacing: 2px;
      transform: translateX(0px);
    }

    100% {
      letter-spacing: 1px;
      transform: translateX(0px);
    }
  }

  @keyframes loading_713 {
    0% {
      width: 16px;
      transform: translateX(0px);
    }

    40% {
      width: 100%;
      transform: translateX(0px);
    }

    80% {
      width: 16px;
      transform: translateX(64px);
    }

    90% {
      width: 100%;
      transform: translateX(0px);
    }

    100% {
      width: 16px;
      transform: translateX(0px);
    }
  }

  @keyframes loading2_713 {
    0% {
      transform: translateX(0px);
      width: 16px;
    }

    40% {
      transform: translateX(0%);
      width: 80%;
    }

    80% {
      width: 100%;
      transform: translateX(0px);
    }

    90% {
      width: 80%;
      transform: translateX(15px);
    }

    100% {
      transform: translateX(0px);
      width: 16px;
    }
  }

  // Search Bar
  .group {
    display: flex;
    line-height: 28px;
    align-items: center;
    position: relative;
    max-width: 2000px;
  }

  .input {
    font-family: "Montserrat", sans-serif;
    width: 1000%;
    height: 45px;
    padding-left: 2.5rem;
    box-shadow: 0 0 0 1.5px #2b2c37, 0 0 25px -17px #000;
    border: 0;
    border-radius: 12px;
    background-color: #16171d;
    outline: none;
    color: #bdbecb;
    transition: all 0.25s cubic-bezier(0.19, 1, 0.22, 1);
    cursor: text;
    z-index: 0;
  }

  .input::placeholder {
    color: #bdbecb;
  }

  .input:hover {
    box-shadow: 0 0 0 2.5px #2f303d, 0px 0px 25px -15px #000;
  }

  .input:active {
    transform: scale(0.95);
  }

  .input:focus {
    box-shadow: 0 0 0 2.5px #2f303d;
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    fill: #bdbecb;
    width: 1rem;
    height: 1rem;
    pointer-events: none;
    z-index: 1;
  }

  // Table Shadow

  .shadow-card {
    background-color:rgb(251, 251, 251); /* Optional: subtle card background */
    border-radius: 1rem;
    padding: 1rem;
    box-shadow: 0 4px 20px rgba(197, 186, 186, 0.05),
      /* soft white glow */ 0 2px 10px rgba(0, 0, 0, 0.5); /* deeper black shadow */
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .shadow-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 24px rgba(255, 241, 241, 0.08),
      /* brighter glow on hover */ 0 4px 12px rgba(0, 0, 0, 0.6); /* stronger depth */
  }

  
  // For button

  .boton-elegante {
    padding: 8px 15px;
    border: 2px solid #2c2c2c;
    background-color: #1a1a1a;
    color: #ffffff;
    font-size: 0.8rem;
    cursor: pointer;
    border-radius: 30px;
    transition: all 0.4s ease;
    outline: none;
    position: relative;
    overflow: hidden;
    font-weight: bold;
  }

  .boton-elegante::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.25) 0%,
      rgba(255, 255, 255, 0) 70%
    );
    transform: scale(0);
    transition: transform 0.5s ease;
  }

  .boton-elegante:hover::after {
    transform: scale(4);
  }

  .boton-elegante:hover {
    border-color: #666666;
    background: #292929;
  }

`;
export default StyledWrapper;
