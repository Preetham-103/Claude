import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCartShopping,
  FaHouse,
  FaBookOpen,
  FaArrowRightFromBracket,
  FaUserShield
} from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import bookicon from "../../assets/books.png";
import "./Navbar.css";
import axios from "../../services/api";
import EventEmitter from "../../utils/cartEvents";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState();
  const [profileImage, setProfileImage] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    setIsLogin(!!token);
    if (user?.role) {
      setRole(user.role.toUpperCase());
      setUserName(user.name);
      setUserId(user.userId);
    }
    if (user?.userId && token) {
      fetch(`http://localhost:8000/profile/view/${user.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.imageBase64) {
            setProfileImage(`data:image/jpeg;base64,${data.imageBase64}`);
          }
        })
        .catch((err) => console.error("Failed to load profile:", err));
    }

    const handelProfileUpdate = (newImaageUrl) => {
      console.log("NavBar: recieved image");
      if (newImaageUrl) setProfileImage(newImaageUrl);
    }

    EventEmitter.on("profileUpdated", handelProfileUpdate)
    return () => {
      EventEmitter.off("profileUpdated", handelProfileUpdate);
    }
  }, []);

  const fetchCartItems = async () => {
    try {
      if (!userId) return;
      const res = await axios.get(`/api/v1/cart/${userId}/viewAllProducts`);
      setCartItems(res.data);
    } catch (error) {
      console.log("Error Getting cart Items", error);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchCartItems();
    const handleCartUpdate = (updatedCartData) => {
      if (updatedCartData && Array.isArray(updatedCartData)) {
        setCartItems(updatedCartData);
      } else {
        fetchCartItems();
      }
    };
    EventEmitter.on("cartUpdated", handleCartUpdate);
    return () => EventEmitter.off("cartUpdated", handleCartUpdate);
  }, [userId]);

  const logout = () => {
    localStorage.clear();
    setIsLogin(false);
    navigate("/");
    window.location.reload();
  };
  const goToCart = () => {
    navigate("/user/cart");
  };

  const goToAdminDashboard = () => {
    navigate("/admin/dashboard");
  };

  const handleProfileClick = () => {
    navigate("/user/profile");
  };

  const toggleNavbar = () => setIsCollapsed(!isCollapsed);
  const closeNavbar = () => setIsCollapsed(true);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container-fluid px-3 px-lg-5">
        {/* Brand */}
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center"
          onClick={closeNavbar}
        >
          <img src={bookicon} alt="BookHaven Logo" className="navbar-logo me-2" />
          <span className="brand-text">BookHaven</span>
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={toggleNavbar}
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${!isCollapsed ? "show" : ""}`}>
          <div className="d-flex flex-column flex-lg-row justify-content-between w-100 align-items-lg-center">
            {/* Left Links */}
            <ul className="navbar-nav flex-row gap-3 mb-3 mb-lg-0">
              <li className="nav-item">
                <Link
                  to="/"
                  className="nav-link px-3 py-2 rounded transition-all d-flex align-items-center gap-2"
                  onClick={closeNavbar}
                >
                  <FaHouse />
                  <span className="d-none d-lg-inline">Home</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/user/home"
                  className="nav-link px-3 py-2 rounded transition-all d-flex align-items-center gap-2"
                  onClick={closeNavbar}
                >
                  <FaBookOpen />
                  <span className="d-none d-lg-inline">Book Catalog</span>
                </Link>
              </li>
            </ul>

            {/* Right Controls */}
            <div className="d-flex align-items-center flex-wrap justify-content-end gap-3">
              {role === "ADMIN" && (
                <button
                  className="btn btn-outline-light btn-sm px-3 py-2 rounded-pill d-flex align-items-center gap-2"
                  onClick={() => {
                    goToAdminDashboard();
                    closeNavbar();
                  }}
                >
                  <FaUserShield />
                  <span className="d-none d-lg-inline admin-dashboard">Admin Dashboard</span>
                </button>
              )}

              <div
                className="cart-icon-container"
                onClick={() => {
                  goToCart();
                  closeNavbar();
                }}
              >
                <FaCartShopping className="cart-icon" />
                <span className="cart-badge">{cartItems?.length || "0"}</span>
              </div>

              {isLogin ? (
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="user-profile-section d-flex align-items-center gap-2"
                    onClick={() => {
                      handleProfileClick();
                      closeNavbar();
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {profileImage ? (
                      <img src={profileImage} alt="User" className="user-avatar" />
                    ) : (
                      <div className="user-avatar-placeholder">
                        <FaRegUser className="user-icon" />
                      </div>
                    )}
                    <div className="d-flex flex-column">
                      <span className="user-name">{userName}</span>
                      <span className="user-role">{role}</span>
                    </div>
                  </div>

                  <button
                    className="btn btn-outline-danger btn-sm px-3 py-2 rounded-pill logout-button d-flex align-items-center gap-2"
                    onClick={() => {
                      logout();
                      closeNavbar();
                    }}
                  >
                    <FaArrowRightFromBracket />
                    <span className="d-none d-lg-inline">Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-primary btn-sm px-4 py-2 rounded-pill"
                  onClick={closeNavbar}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>

  );
};

export default Navbar;
