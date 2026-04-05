import { useEffect, useState } from "react";
import axios from "../../services/api";
import "./customers.css";

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState("active");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [statusFilter, roleFilter, users, deletedUsers]);

  const loadUsers = async () => {
    const activeRes = await axios.get("/user/viewallusers");
    const deletedRes = await axios.get("/user/getalldeletedusers");
    setUsers(activeRes.data);
    setDeletedUsers(deletedRes.data);
  };

  const applyFilters = () => {
    let data = statusFilter === "active" ? users : deletedUsers;
    if (roleFilter !== "all") {
      data = data.filter(user => user.role?.toLowerCase() === roleFilter);
    }
    setFiltered(data);
  };

  const handleDelete = async (userId) => {
    await axios.delete(`/user/deleteuser/${userId}`);
    loadUsers();
  };

  const handleRecover = async (userId) => {
    await axios.put(`/user/recoveraccountbyuserid/${userId}`);
    loadUsers();
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("user");
    setEditingUser(null);
  };

  return (
    <div className="customers-page">
      <div className="customers-header">
        <h2>Customers</h2>
      </div>

      <div className="filters">
        <div className="status-filter">
          <button
            onClick={() => setStatusFilter("active")}
            className={statusFilter === "active" ? "active" : ""}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter("deleted")}
            className={statusFilter === "deleted" ? "active" : ""}
          >
            Deleted
          </button>
        </div>
        <div className="role-filter">
          <select onChange={(e) => setRoleFilter(e.target.value)} value={roleFilter}>
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>


      <table className="customers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((user, i) => (
            <tr key={i}>
              <td>{user.name}</td>
              <td >
                {user.profile?.imageBase64 ? (
                  <img
                    src={`data:image/png;base64,${user.profile.imageBase64}`}
                    alt="profile"
                    className="profile-thumb"
                  />
                ) : (
                  <div className="placeholder-thumb">N/A</div>
                )}
              </td>
              <td>{user.email}</td>
              <td><span className="badge">{user.role}</span></td>
              <td>
                <span className={`badge ${statusFilter === "active" ? "active" : "deleted"}`}>
                  {statusFilter === "active" ? "Active" : "Deleted"}
                </span>
              </td>
              <td>
                {statusFilter === "active" ? (
                  <>
                    <button className="delete-btn" onClick={() => handleDelete(user.userId)}>Delete</button>
                  </>
                ) : (
                  <button className="undo-btn" onClick={() => handleRecover(user.userId)}>Undo</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default Customers;
