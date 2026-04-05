import { useEffect, useState } from "react";
import axios from "../../services/api";
import "./Dashboard.css";


const Dashboard = () => {
    const [metrics, setMetrics] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        avgOrderValue: 0,

        revenueChange: 0,
        orderChange: 0,
        customerChange: 0,
        avgOrderChange: 0,
    });

    const [orders, setOrders] = useState([]);
    const [userName, setUserName] = useState("");
    const [categories, setCategories] = useState([]);
    const [stockBooks, setStockBooks] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        setUserName(user.name);

        const fetchDashboardData = async () => {
            try {
                const [ordersRes, usersRes, categoriesRes, booksRes] = await Promise.all([
                    axios.get("/bookstore/getAllOrders"),
                    axios.get("/user/viewallusers"),
                    axios.get("/bookmanage/viewallcategories"),
                    axios.get("/bookmanage/viewallbooks"),
                ]);

                const ordersRaw = ordersRes.data;
                const users = usersRes.data;
                const books = booksRes.data;

                const userMap = {};
                users.forEach((user) => {
                    userMap[user.userId] = user.name;
                });

                const totalRevenue = ordersRaw.reduce((sum, order) => sum + order.totalAmount, 0);
                const avgOrderValue = ordersRaw.length ? totalRevenue / ordersRaw.length : 0;

                const orderData = ordersRaw.map((order, idx) => ({
                    orderId: `ORD${1000 + idx}`,
                    customer: userMap[order.userId] || "Unknown",
                    date: order.orderDate,
                    status: order.status,
                    totalAmount: order.totalAmount.toFixed(2),
                }));

                setOrders(orderData);
                setCategories(categoriesRes.data);

                // Fetch authors for each book
                const enrichedBooks = await fetchAuthorForBooks(books);
                setStockBooks(enrichedBooks);

                setMetrics({
                    totalRevenue: totalRevenue.toFixed(2),
                    totalOrders: ordersRes.data.length,
                    totalCustomers: usersRes.data.length,
                    avgOrderValue: avgOrderValue.toFixed(2),
                });
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };

        fetchDashboardData();
    }, []);

    const fetchAuthorForBooks = async (books) => {
        const updatedBooks = await Promise.all(
            books.map(async (book) => {
                try {
                    const res = await axios.get(`/bookmanage/authorbybookid/${book.bookId}`);
                    return {
                        ...book,
                        authorName: res.data.authName || "Unknown",
                    };
                } catch (err) {
                    return {
                        ...book,
                        authorName: "Unknown",
                    };
                }
            })
        );
        return updatedBooks;
    };

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-heading">Welcome back, {userName}!</h2>
            <p className="dashboard-subtitle">Here's a snapshot of your bookstore's performance.</p>

            <div className="metrics-grid">
                <MetricCard label="Total Revenue" value={`₹${metrics.totalRevenue}`} />
                <MetricCard label="Orders Processed" value={metrics.totalOrders} />
                <MetricCard label="New Customers" value={metrics.totalCustomers} />
                <MetricCard label="Avg Order Value" value={`₹${metrics.avgOrderValue}`} />
            </div>

            <div className="orders-section">
                <h3 className="admin-section-heading">Recent Activity</h3>
                <div className="scrollable-table">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Total ($)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, i) => (
                                <tr key={i}>
                                    <td>{order.orderId}</td>
                                    <td>{order.customer}</td>
                                    <td>{order.date}</td>
                                    <td>{order.status}</td>
                                    <td>{order.totalAmount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="stock-alert-section">
                <h3 className="admin-section-heading">Stock Alerts</h3>
                <div className="scrollable-table">
                    <table className="stock-alert-table">
                        <thead>
                            <tr>
                                <th>Book Title</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Stock Level</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockBooks.map((book, index) => {
                                let action = "";
                                if (book.stockQuantity < 5) action = "Critical - Restock";
                                else if (book.stockQuantity >= 5 && book.stockQuantity <= 10) action = "Low Stock";
                                else action = "Stock Sufficient";

                                return (
                                    <tr key={index}>
                                        <td>{book.title}</td>
                                        <td>{book.authorName}</td>
                                        <td>{book.category?.catName}</td>
                                        <td>{book.stockQuantity}</td>
                                        <td
                                            className={
                                                action.includes("Critical")
                                                    ? "critical"
                                                    : action.includes("Low")
                                                        ? "low"
                                                        : "normal"
                                            }
                                        >
                                            {action}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ label, value, change }) => (
    <div className="metric-card">
        <p className="metric-label">{label}</p>
        <p className="metric-value">{value}</p>
        {change && <span className="metric-change">{change}</span>}
    </div>
);

export default Dashboard;
