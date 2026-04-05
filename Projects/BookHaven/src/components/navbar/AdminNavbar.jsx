import { useEffect, useState } from "react";
import axios from "../../services/api";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const [userName, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.userId) {
      axios
        .get(`/profile/view/${user.userId}`)
        .then((res) => {
          setUserName(user.name);
          if (res.data.imageBase64) {
            setProfileImage(`data:image/jpeg;base64,${res.data.imageBase64}`);
          }
        })
        .catch((err) => {
          console.error("Failed to load profile:", err);
        });
    }
  }, []);

  return (
    <header className="admin-navbar">
      <h2 className="admin-title">
        <span class="material-symbols-outlined">store</span>
        BookHaven
      </h2>

      <div className="admin-controls">
        <div className="admin-user-info">
          <span className="admin-username">{userName}</span>
          {profileImage && (
            <img
              src={profileImage}
              alt="Profile"
              className="admin-avatar"
            />
          )}
        </div>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
