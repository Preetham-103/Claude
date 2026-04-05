import React, { useEffect, useState } from 'react';
import axios from '../../services/api';
import './analytics.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Analytics = () => {
  const [orders, setOrders] = useState([]);
  const [books, setBooks] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [reportType, setReportType] = useState('');
  const [timePeriod, setTimePeriod] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const orderRes = await axios.get('/bookstore/getAllOrders');
    const bookRes = await axios.get('/bookmanage/viewallbooks');
    setOrders(orderRes.data);
    setBooks(bookRes.data);
    processSalesData(orderRes.data);
    processCategorySales(orderRes.data, bookRes.data);
  };

  const processSalesData = (orders) => {
    const data = Array(12).fill(0);
    orders.forEach(order => {
      const month = new Date(order.orderDate).getMonth();
      data[month] += order.totalAmount;
    });
    setSalesData(data.map((val, idx) => ({ month: months[idx], revenue: val })));
  };

  const processCategorySales = (orders, books) => {
    const categoryMap = {};
    orders.forEach(order => {
      order.books.forEach(book => {
        const matchedBook = books.find(b => b.bookId === book.bookId);
        const category = matchedBook?.category?.catName || "Unknown";
        categoryMap[category] = (categoryMap[category] || 0) + book.quantity;
      });
    });
    setCategorySales(Object.entries(categoryMap).map(([cat, sold]) => ({ category: cat, sold })));
  };

  const handleGenerateReport = () => {
    if (!reportType || !timePeriod) return alert("Please select both type and period");

    const now = new Date();
    let filteredOrders = [];

    if (timePeriod === "last7") {
      const limit = new Date(now);
      limit.setDate(now.getDate() - 7);
      filteredOrders = orders.filter(o => new Date(o.orderDate) >= limit);
    } else if (timePeriod === "last30") {
      const limit = new Date(now);
      limit.setDate(now.getDate() - 30);
      filteredOrders = orders.filter(o => new Date(o.orderDate) >= limit);
    } else if (timePeriod === "monthly") {
      const m = now.getMonth(), y = now.getFullYear();
      filteredOrders = orders.filter(o => {
        const d = new Date(o.orderDate);
        return d.getMonth() === m && d.getFullYear() === y;
      });
    }

    let csv = "data:text/csv;charset=utf-8,";

    if (reportType === "sales") {
      csv += "Order ID,Date,Total Amount,Status\n";
      filteredOrders.forEach(o => {
        csv += `${o.orderId},${o.orderDate},${o.totalAmount},${o.status}\n`;
      });
    } else {
      const categoryMap = {};
      filteredOrders.forEach(o => {
        o.books.forEach(b => {
          const matched = books.find(book => book.bookId === b.bookId);
          const cat = matched?.category?.catName || "Unknown";
          categoryMap[cat] = (categoryMap[cat] || 0) + b.quantity;
        });
      });
      csv += "Category,Total Sold\n";
      Object.entries(categoryMap).forEach(([cat, count]) => {
        csv += `${cat},${count}\n`;
      });
    }

    const uri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", uri);
    link.setAttribute("download", `report_${reportType}_${timePeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="analytics-page">
      <h2>Sales Trends</h2>
      <div className="charts-section">
        <div className="chart-card">
          <h4>Monthly Sales Revenue</h4>
          <h2>₹{salesData.reduce((sum, s) => sum + s.revenue, 0).toLocaleString()}</h2>
          <p>Last 12 Months</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={salesData}>
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#aaa" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>Top Selling Categories</h4>
          <h2>{categorySales.reduce((sum, c) => sum + c.sold, 0)} copies</h2>
          <p>This Month</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categorySales}>
              <XAxis dataKey="category" stroke="#ccc" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sold" fill="#444" />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="reporting-section">
        <h2>Reporting Options</h2>
        <label>Report Type</label>
        <select value={reportType} onChange={e => setReportType(e.target.value)}>
          <option value="">Select Type</option>
          <option value="sales">Sales Report</option>
          <option value="category">Category Report</option>
        </select>

        <label>Time Period</label>
        <select value={timePeriod} onChange={e => setTimePeriod(e.target.value)}>
          <option value="">Select Period</option>
          <option value="last7">Last 7 Days</option>
          <option value="last30">Last 30 Days</option>
          <option value="monthly">Monthly</option>
        </select>

        <button onClick={handleGenerateReport}>Generate Report</button>
      </div>
    </div>
  );
};

export default Analytics;



