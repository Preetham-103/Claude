import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cartService } from "../../../services/cartService";
import EventEmitter from '../../../utils/cartEvents';
import './ShoppingCart.css';


const ShoppingCart = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user.userId;
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  // New state to manage individual item errors
  const [itemErrors, setItemErrors] = useState({});

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await cartService.getCartItems(userId);
      setCartItems(items);
      setMessage(null);
      setItemErrors({}); // Clear item-specific errors on successful fetch
      return items;
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setError(
        "Failed to load cart items. Please check your network or try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    let subtotal = 0;
    cartItems.forEach((item) => {
      subtotal += (item.bookPrice ?? 0) * (item.quantity ?? 0);
    });

    const shipping = 5.0;
    const taxes = subtotal * 0.075;
    const total = subtotal + shipping + taxes;

    return { subtotal, shipping, taxes, total };
  };

  const totals = calculateTotals();

  useEffect(() => {
    fetchCart();
  }, [userId]);

  useEffect(() => {
    if (!loading && error === null) {
      const currentGrandTotal = totals.total;
      const updateBackendTotal = async () => {
        try {
          await cartService.updateCartTotal(userId, currentGrandTotal);
          console.log(
            `Cart total (${currentGrandTotal.toFixed(
              2
            )}) sent to backend successfully.`
          );
        } catch (err) {
          console.error(
            `Error sending cart total (${currentGrandTotal.toFixed(
              2
            )}) to backend:`,
            err.response?.data || err.message
          );
        }
      };
      updateBackendTotal();
    }
  }, [cartItems, totals.total, userId, loading, error]);

  const handleIncreaseQuantity = async (bookId) => {
    // Clear previous error for this item
    setItemErrors(prevErrors => ({ ...prevErrors, [bookId]: null }));
    try {
      await cartService.increaseProductQuantity(userId, bookId, 1);
      fetchCart();
    } catch (err) {
      // Set the error for the specific item
      setItemErrors(prevErrors => ({
        ...prevErrors,
        [bookId]: "Out of Stock"
      }));
      console.error("Error increasing quantity:", err);
    }
  };

  const handleDecreaseQuantity = async (bookId) => {
    // Clear previous error for this item
    setItemErrors(prevErrors => ({ ...prevErrors, [bookId]: null }));
    try {
      await cartService.decreaseProductQuantity(userId, bookId, 1);
      fetchCart();
    } catch (err) {
      // Set the error for the specific item
      setItemErrors(prevErrors => ({
        ...prevErrors,
        [bookId]: `Failed to decrease quantity: ${err.response?.data || err.message}`
      }));
      console.error("Error decreasing quantity:", err);
    }
  };

  const handleRemoveProduct = async (bookId) => {
    if (!(await showConfirm("Are you sure you want to remove this item?"))) {
      return;
    }
    try {
      await cartService.removeProductFromCart(userId, bookId);
      const updatedcart = await fetchCart();
      EventEmitter.emit('cartUpdated', updatedcart);
    } catch (err) {
      showMessageBox(`Failed to remove item: ${err.response?.data || err.message}`);
      console.error("Error removing item:", err);
    }
  };

  const handleClearCart = async () => {
    if (
      !(await showConfirm("Are you sure you want to clear your entire cart?"))
    ) {
      return;
    }
    try {
      await cartService.clearCart(userId);
      showMessageBox("Cart cleared successfully!");
      setCartItems([]);
      setItemErrors({}); // Clear all item errors when cart is cleared
      EventEmitter.emit('cartUpdated', []);
    } catch (err) {
      showMessageBox(`Failed to clear cart: ${err.response?.data || err.message}`);
      console.error("Error clearing cart:", err);
    }
  };

  const handleProceedToCheckout = async () => {
    try {
      await cartService.updateCartTotal(userId, totals.total);
      console.log("Cart total updated on backend before checkout.");

      console.log(
        "Proceed to Checkout clicked. (This UI action is for demonstration)."
      );
      navigate("/user/payment");

    } catch (err) {
      console.error(
        "Error updating cart total before checkout:",
        err.response?.data || err.message
      );
      showMessageBox(
        `Failed to sync cart total before checkout: ${err.response?.data || err.message
        }`
      );
    }
  };

  // The showConfirm and showMessageBox functions remain unchanged as they are for general confirmations/messages.
  const showConfirm = (msg) => {
    return new Promise((resolve) => {
      const confirmModal = document.createElement("div");
      confirmModal.className = "modal fade show d-block";
      confirmModal.tabIndex = "-1";
      confirmModal.style.backgroundColor = "rgba(0,0,0,0.5)";
      confirmModal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content bg-dark text-white rounded-3 shadow">
            <div class="modal-header border-bottom border-secondary">
              <h5 class="modal-title">Confirm Action</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>${msg}</p>
            </div>
            <div class="modal-footer border-top border-secondary">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-danger" id="confirmOk">OK</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(confirmModal);

      const closeButton = confirmModal.querySelector(".btn-close");
      const cancelButton = confirmModal.querySelector(".btn-secondary");
      const okButton = confirmModal.querySelector("#confirmOk");

      const cleanup = () => {
        confirmModal.remove();
      };

      closeButton.onclick = () => {
        cleanup();
        resolve(false);
      };

      cancelButton.onclick = () => {
        cleanup();
        resolve(false);
      };

      okButton.onclick = () => {
        cleanup();
        resolve(true);
      };
    });
  };

  const showMessageBox = (msg) => {
    return new Promise((resolve) => {
      const messageModal = document.createElement("div");
      messageModal.className = "modal fade show d-block";
      messageModal.tabIndex = "-1";
      messageModal.style.backgroundColor = "rgba(0,0,0,0.5)";
      messageModal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content bg-dark text-white rounded-3 shadow">
            <div class="modal-header border-bottom border-secondary">
              <h5 class="modal-title">Message</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>${msg}</p>
            </div>
            <div class="modal-footer border-top border-secondary">
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(messageModal);

      const closeButton = messageModal.querySelector(".btn-close");
      const okButton = messageModal.querySelector(".btn-primary");

      const cleanup = () => {
        messageModal.remove();
        resolve();
      };

      closeButton.onclick = cleanup;
      okButton.onclick = cleanup;
    });
  };

  return (
    <div
      className="d-flex flex-column min-vh-100 text-white"
      style={{ backgroundColor: "#131516" }}
    >
      <div
        className="d-flex flex-grow-1 justify-content-center py-3 py-md-5"
        style={{ paddingLeft: "15px", paddingRight: "15px" }}
      >
        <div
          className="d-flex flex-column flex-grow-1"
          style={{ maxWidth: "960px", backgroundColor: "#131516" }}
        >
          <button className="cart-back-btn p-2 p-md-4" onClick={() => navigate(-1)}>
            ← Back
          </button>
          
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 px-2 px-md-4 py-2">
            <h1 className="text-white fs-2 fw-bold lh-sm mb-0">Shopping Cart</h1>
            <button
              type="button"
              className="btn btn-danger btn-sm btn-md-normal"
              onClick={handleClearCart}
              disabled={cartItems.length === 0}
            >
              Clear Cart
            </button>
          </div>

          {message && (
            <div
              className={`px-2 px-md-4 py-2 mt-2 ${message.includes("Failed") ? "text-danger" : "text-success"
                }`}
            >
              {message}
            </div>
          )}

          <div className="p-2 p-md-4">
            {/* Desktop Table View */}
            <div className="d-none d-lg-block">
              <div
                className="overflow-hidden rounded-3 border border-secondary"
                style={{ backgroundColor: "#131516" }}
              >
                <table className="table table-dark table-striped mb-0">
                  <thead>
                    <tr style={{ backgroundColor: "#1e2124" }}>
                      <th
                        scope="col"
                        className="px-4 py-3 text-start text-white fs-6 fw-medium"
                        style={{ width: "40%" }}
                      >
                        Item
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-start text-white fs-6 fw-medium"
                        style={{ width: "15%" }}
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-start text-white fs-6 fw-medium"
                        style={{ width: "20%" }}
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-start text-white fs-6 fw-medium"
                        style={{ width: "15%" }}
                      >
                        Subtotal
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-start text-white fs-6 fw-medium"
                        style={{ width: "10%" }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <tr key={item.bookId}>
                          <td
                            className="px-4 py-2 text-white fs-6 fw-normal"
                            style={{ height: "72px" }}
                          >
                            <div className="d-flex align-items-center">
                              {item.imageBase64 ? (
                                <img
                                  src={`data:image/jpeg;base64,${item.imageBase64}`}
                                  alt={item.bookName}
                                  className="me-3 rounded-1"
                                  style={{ width: "50px", height: "70px", objectFit: "cover" }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://placehold.co/50x70/2d3134/E2DFD2?text=No+Image";
                                  }}
                                />
                              ) : (
                                <div
                                  className="me-3 rounded-1 d-flex align-items-center justify-content-center"
                                  style={{
                                    width: "50px",
                                    height: "70px",
                                    backgroundColor: "#2d3134",
                                    color: "#E2DFD2",
                                    fontSize: "0.75rem",
                                    textAlign: "center"
                                  }}
                                >
                                  No Image
                                </div>
                              )}
                              {item.bookName}
                            </div>
                          </td>
                          <td
                            className="px-4 py-2 fs-6 fw-normal"
                            style={{ height: "72px", color: "#E2DFD2" }}
                          >
                            ₹ {(item.bookPrice ?? 0).toFixed(2)}
                          </td>
                          <td
                            className="px-4 py-2 text-secondary fs-6 fw-normal"
                            style={{ height: "72px" }}
                          >
                            <div className="d-flex align-items-center">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary me-2"
                                style={{ color: "#E2DFD2" }}
                                onClick={() =>
                                  handleDecreaseQuantity(item.bookId)
                                }
                                disabled={(item.quantity ?? 0) <= 1}
                              >
                                -
                              </button>
                              <span style={{ color: "#E2DFD2" }}>
                                {item.quantity ?? 0}{" "}
                              </span>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary ms-2"
                                style={{ color: "#E2DFD2" }}
                                onClick={() =>
                                  handleIncreaseQuantity(item.bookId)
                                }
                              >
                                +
                              </button>
                            </div>
                            {/* Display item-specific error here */}
                            {itemErrors[item.bookId] && (
                              <p className="text-danger mt-1 mb-0" style={{ fontSize: '0.85em' }}>
                                {itemErrors[item.bookId]}
                              </p>
                            )}
                          </td>
                          <td
                            className="px-4 py-2 fs-6 fw-normal"
                            style={{ height: "72px", color: "#E2DFD2" }}
                          >
                            ₹{" "}
                            {(
                              (item.bookPrice ?? 0) * (item.quantity ?? 0)
                            ).toFixed(2)}
                          </td>
                          <td className="px-4 py-2" style={{ height: "72px" }}>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => handleRemoveProduct(item.bookId)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-4 text-secondary"
                        >
                          Your cart is empty.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="d-block d-lg-none">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.bookId} className="card bg-dark border-secondary mb-3">
                    <div className="card-body p-3">
                      <div className="row g-3">
                        <div className="col-12 col-sm-4">
                          <div className="d-flex align-items-center">
                            {item.imageBase64 ? (
                              <img
                                src={`data:image/jpeg;base64,${item.imageBase64}`}
                                alt={item.bookName}
                                className="me-3 rounded-1"
                                style={{ width: "60px", height: "80px", objectFit: "cover" }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://placehold.co/60x80/2d3134/E2DFD2?text=No+Image";
                                }}
                              />
                            ) : (
                              <div
                                className="me-3 rounded-1 d-flex align-items-center justify-content-center"
                                style={{
                                  width: "60px",
                                  height: "80px",
                                  backgroundColor: "#2d3134",
                                  color: "#E2DFD2",
                                  fontSize: "0.75rem",
                                  textAlign: "center"
                                }}
                              >
                                No Image
                              </div>
                            )}
                            <div className="flex-grow-1">
                              <h6 className="text-white mb-1">{item.bookName}</h6>
                              <p className="mb-0" style={{ color: "#E2DFD2" }}>
                                ₹ {(item.bookPrice ?? 0).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-12 col-sm-8">
                          <div className="row g-2">
                            <div className="col-12 col-sm-6">
                              <label className="form-label text-white small">Quantity</label>
                              <div className="d-flex align-items-center">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary me-2"
                                  style={{ color: "#E2DFD2", minWidth: "32px" }}
                                  onClick={() => handleDecreaseQuantity(item.bookId)}
                                  disabled={(item.quantity ?? 0) <= 1}
                                >
                                  -
                                </button>
                                <span style={{ color: "#E2DFD2", minWidth: "30px", textAlign: "center" }}>
                                  {item.quantity ?? 0}
                                </span>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary ms-2"
                                  style={{ color: "#E2DFD2", minWidth: "32px" }}
                                  onClick={() => handleIncreaseQuantity(item.bookId)}
                                >
                                  +
                                </button>
                              </div>
                              {itemErrors[item.bookId] && (
                                <p className="text-danger mt-1 mb-0" style={{ fontSize: '0.85em' }}>
                                  {itemErrors[item.bookId]}
                                </p>
                              )}
                            </div>
                            
                            <div className="col-12 col-sm-6">
                              <label className="form-label text-white small">Subtotal</label>
                              <p className="mb-2" style={{ color: "#E2DFD2" }}>
                                ₹ {((item.bookPrice ?? 0) * (item.quantity ?? 0)).toFixed(2)}
                              </p>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm w-100"
                                onClick={() => handleRemoveProduct(item.bookId)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5">
                  <p className="text-secondary fs-5">Your cart is empty.</p>
                </div>
              )}
            </div>
          </div>

          <div className="px-2 px-md-4">
            <div className="cart-summary-box">
              <h3 className="text-white fs-5 fw-bold lh-sm pb-2">
                Cart Summary
              </h3>

              <div className="row g-0 border-top border-secondary py-3">
                <div className="col-6 col-sm-8">
                  <p className="fs-6 fw-normal mb-0" style={{ color: "#E2DFD2" }}>Subtotal</p>
                </div>
                <div className="col-6 col-sm-4 text-end">
                  <p className="text-white fs-6 fw-normal mb-0">₹ {totals.subtotal.toFixed(2)}</p>
                </div>
              </div>

              <div className="row g-0 border-top border-secondary py-3">
                <div className="col-6 col-sm-8">
                  <p className="fs-6 fw-normal mb-0" style={{ color: "#E2DFD2" }}>Shipping</p>
                </div>
                <div className="col-6 col-sm-4 text-end">
                  <p className="text-white fs-6 fw-normal mb-0">₹ {totals.shipping.toFixed(2)}</p>
                </div>
              </div>

              <div className="row g-0 border-top border-secondary py-3">
                <div className="col-6 col-sm-8">
                  <p className="fs-6 fw-normal mb-0" style={{ color: "#E2DFD2" }}>Taxes</p>
                </div>
                <div className="col-6 col-sm-4 text-end">
                  <p className="text-white fs-6 fw-normal mb-0">₹ {totals.taxes.toFixed(2)}</p>
                </div>
              </div>

              <div className="row g-0 border-top border-secondary py-3">
                <div className="col-6 col-sm-8">
                  <p className="fs-6 fw-bold mb-0 text-white">Total</p>
                </div>
                <div className="col-6 col-sm-4 text-end">
                  <p className="cart-total-value fs-5 mb-0">₹ {totals.total.toFixed(2)}</p>
                </div>
              </div>

              <p className="mb-0 mt-1" style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                Shipping costs may vary depending on your location and selected delivery method.
              </p>
            </div>
          </div>

          <div className="d-flex px-2 px-md-4 py-3 justify-content-center justify-content-sm-end">
            <button
              type="button"
              className="btn-checkout"
              onClick={handleProceedToCheckout}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;