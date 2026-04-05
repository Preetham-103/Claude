import React, { useState, useEffect} from 'react';
import { getOrdersByUserId } from '../../../services/invoice';
import { useNavigate } from 'react-router-dom';

const OrderHistory = ({ userId }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userId) {
                setError("User ID not provided to fetch order history.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const fetchedOrders = await getOrdersByUserId(userId);
                console.log("Fetched orders response:", fetchedOrders);

                // Normalize response to an array
                if (Array.isArray(fetchedOrders)) {
                    setOrders(fetchedOrders);
                } else if (Array.isArray(fetchedOrders?.data)) {
                    setOrders(fetchedOrders.data);
                } else {
                    console.warn("Unexpected response format for orders:", fetchedOrders);
                    setOrders([]);
                }
            } catch (err) {
                console.error("Error fetching order history:", err);
                setError("Failed to load order history. Please check the order service.");
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    const navigateToHomePage = ()=>{
        navigate("/");
    };

    const getStatusButtonClass = (status) => {
        switch (status?.toUpperCase()) {
            case 'DELIVERED':
                return 'btn-success';
            case 'SHIPPED':
                return 'btn-primary';
            case 'PROCESSING':
                return 'btn-warning';
            case 'CANCELLED':
                return 'btn-danger';
            case 'PENDING':
                return 'btn-info';
            default:
                return 'btn-secondary';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toUpperCase()) {
            case 'DELIVERED':
                return '✓';
            case 'SHIPPED':
                return '🚚';
            case 'PROCESSING':
                return '⏳';
            case 'CANCELLED':
                return '✕';
            case 'PENDING':
                return '⏸';
            default:
                return '•';
        }
    };

    if (loading) {
        return (
            <div className="bg-dark min-vh-100">
                <div className="container-fluid px-4 py-5">
                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                        <div className="spinner-border text-light mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                            <span className="visually-hidden">Loading orders...</span>
                        </div>
                        <h4 className="text-light mb-2">Loading Order History</h4>
                        <p className="text-secondary">Please wait while we fetch your orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-dark min-vh-100">
                <div className="container-fluid px-4 py-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6">
                            <div className="alert alert-danger border-0 shadow-lg" role="alert">
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
                                    <div>
                                        <h5 className="alert-heading mb-1">Error Loading Orders</h5>
                                        <p className="mb-0">{error}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-dark min-vh-100">
            <div className="container-fluid px-0">
                {/* Header Section */}
                <div className="bg-dark border-bottom border-secondary">
                    <div className="container-fluid px-4 py-4">
                        <div className="row align-items-center">
                            <div className="col">
                                <h1 className="text-white fw-bold mb-1 display-6">Order History</h1>
                                <p className="text-secondary mb-0">Track and manage your recent orders</p>
                            </div>
                            <div className="col-auto">
                                <span className="badge bg-secondary fs-6 px-3 py-2">
                                    {orders.length} Order{orders.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="container-fluid px-4 py-4">
                    {orders.length === 0 ? (
                        <div className="row justify-content-center">
                            <div className="col-md-8 col-lg-6">
                                <div className="text-center py-5">
                                    <div className="mb-4">
                                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="text-secondary">
                                            <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" fill="currentColor"/>
                                        </svg>
                                    </div>
                                    <h4 className="text-light mb-3">No Orders Yet</h4>
                                    <p className="text-secondary mb-4">You haven't placed any orders yet. Start shopping to see your order history here.</p>
                                    <button className="btn btn-primary btn-lg px-4" onClick={navigateToHomePage}>
                                        Start Shopping
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="row">
                            <div className="col-12">
                                {/* Desktop Table View */}
                                <div className="d-none d-lg-block">
                                    <div className="card bg-dark border-secondary shadow-lg">
                                        <div className="table-responsive">
                                            <table className="table table-dark table-hover mb-0">
                                                <thead className="bg-secondary">
                                                    <tr>
                                                        <th className="px-4 py-3 text-white fw-semibold border-0" style={{ width: '20%' }}>
                                                            Order ID
                                                        </th>
                                                        <th className="px-4 py-3 text-white fw-semibold border-0" style={{ width: '20%' }}>
                                                            Date
                                                        </th>
                                                        <th className="px-4 py-3 text-white fw-semibold border-0" style={{ width: '25%' }}>
                                                            Status
                                                        </th>
                                                        <th className="px-4 py-3 text-white fw-semibold border-0 " style={{ width: '20%' }}>
                                                            Total
                                                        </th>
                                                        {/* <th className="px-4 py-3 text-white fw-semibold border-0 text-center" style={{ width: '15%' }}>
                                                            Actions
                                                        </th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orders.map(order => (
                                                        <tr key={order.orderId} className="border-secondary">
                                                            <td className="px-4 py-3 text-white fw-medium">
                                                                #{order.orderId}
                                                            </td>
                                                            <td className="px-4 py-3 text-secondary">
                                                                {order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                }) : 'N/A'}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={`badge ${getStatusButtonClass(order.status)} px-3 py-2 fs-6`}>
                                                                    {getStatusIcon(order.status)} {order.status || 'N/A'}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-white fw-semibold">
                                                                ${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;