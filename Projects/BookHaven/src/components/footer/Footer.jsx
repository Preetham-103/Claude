import React from "react";
import { GiWhiteBook } from "react-icons/gi";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer-container bg-dark text-white pt-4 pb-2">
      <div className="container">
        <div className="row align-items-center text-center text-md-start">
          <div className="col-md-4 mb-3 mb-md-0">
            <h4 className="footer-logo">
              <GiWhiteBook className="mb-1" /> BookHaven
            </h4>
          </div>

          <div className="col-md-4 mb-3 mb-md-0 d-flex justify-content-center">
            <div className="footer-social-icons d-flex gap-3">
              <FaFacebook className="fs-4" />
              <FaInstagram className="fs-4" />
              <FaTwitter className="fs-4" />
              <FaYoutube className="fs-4" />
            </div>
          </div>

          <div className="col-md-4">
            <div className="footer-links d-flex flex-wrap justify-content-center gap-3 text-nowrap">
              <span>Home</span>
              <span>About Us</span>
              <span>Contact Us</span>
              <span>News</span>
              <span>Our Team</span>
            </div>
          </div>
        </div>
        <hr className="border-light my-3" />
        <p className="text-center small mb-0">
          &copy; 2025 BookHaven. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;