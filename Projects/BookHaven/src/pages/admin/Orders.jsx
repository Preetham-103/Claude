import { useEffect, useState } from "react";
import axios from "../../services/api";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sortDate, setSortDate] = useState("latest");
  const [statusFilter, setStatusFilter] = useState("");
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let data = [...orders];

    if (statusFilter) {
      data = data.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase());
    }

    if (sortDate === "latest") {
      data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    } else {
      data.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
    }

    setFilteredOrders(data);
  }, [orders, sortDate, statusFilter]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/bookstore/getAllOrders");
      const ordersData = res.data;
      setOrders(ordersData);

      const userIds = [...new Set(ordersData.map(order => order.userId))];
      const userMapTemp = {};

      await Promise.all(
        userIds.map(async id => {
          try {
            const userRes = await axios.get(`/user/viewuserbyid/${id}`);
            userMapTemp[id] = userRes.data.name || `User #${id}`;
          } catch {
            userMapTemp[id] = `User #${id}`;
          }
        })
      );

      setUserMap(userMapTemp);
    } catch (error) {
      console.error("Error fetching orders or user names", error);
    }
  };

  const getNextStatus = (status) => {
    const flow = ["Pending", "Processing", "Shipped", "Delivered"];
    const index = flow.indexOf(status);
    return index < flow.length - 1 ? flow[index + 1] : null;
  };

  const handleStatusChange = async (orderId, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    if (!nextStatus) return;

    await axios.put(`/bookstore/updateStatusById/${orderId}`, { status: nextStatus });
    fetchOrders();

    if (nextStatus === "Shipped") {
      setTimeout(async () => {
        await axios.put(`/bookstore/updateStatusById/${orderId}`, { status: "Delivered" });
        fetchOrders();
      }, 6 * 1000); // 2 minutes
    }
  };

  return (
    <div className="orders-container">
      <h1>Orders</h1>
      <p>Manage and track all customer orders</p>

      <div className="orders-filters">
        <select value={sortDate} onChange={(e) => setSortDate(e.target.value)}>
          <option value="latest">Sort by: Latest</option>
          <option value="oldest">Sort by: Oldest</option>
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.orderId}>
              <td>#{order.orderId}</td>
              <td>{order.orderDate}</td>
              <td>{userMap[order.userId] || `User #${order.userId}`}</td>
              <td>
                <span className={`status-badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </td>
              <td>₹{order.totalAmount?.toFixed(2)}</td>
              <td>
                {order.status !== "Delivered" && (
                  <button
                    className="status-btn"
                    onClick={() => handleStatusChange(order.orderId, order.status)}
                  >
                    Move to {getNextStatus(order.status)}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
