import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpiPaymentPage = () => {
  return (
    <div className="bg-dark text-white min-vh-100 d-flex justify-content-center align-items-center px-3" style={{ fontFamily: 'Manrope, Noto Sans, sans-serif' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center fw-bold mb-4">UPI Payment</h2>

        <form>
          <div className="mb-3">
            <label className="form-label">UPI ID</label>
            <input
              type="text"
              className="form-control bg-secondary text-white border-0 rounded-pill p-2"
              placeholder="e.g. user@bank"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Delivery Address</label>
            <input
              type="text"
              className="form-control bg-secondary text-white border-0 rounded-pill p-2"
              placeholder="Enter your address"
            />
          </div>

          <div className="mb-3 text-center">
            <p className="text-muted mb-1">Amount to Pay: <strong>$150.00</strong></p>
          </div>

          <button type="submit" className="btn btn-light btn-sm text-dark w-100 rounded-pill py-2 fw-bold">
            Pay Now
          </button>
        </form>

        <p className="text-center text-muted small mt-4">
          By proceeding, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default UpiPaymentPage;
