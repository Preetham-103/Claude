import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/admin/Dashboard";
import AdminLayout from "./layout/AdminLayout";
import { AdminRoute, UserRoute } from "./routes/RoleRoutes";
import Book from "./pages/admin/Book";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";
import Analytics from "./pages/admin/Analytics";
import BookCatalog from './pages/user/Book/BookCatalog';
import BookDetails from "./pages/user/BookDetails/BookDetails";
import Home from "./pages/user/home/Home";
import Main from "./layout/Main";
import ShoppingCart from "./pages/user/cart/ShoppingCart";
import Payment from "./pages/user/payment/Payment";
import Invoice from "./pages/user/invoice/Invoice";
import ProfileDashboard from "./pages/user/profile/ProfileDashboard";
import Unauthorized from "./pages/unauthorized";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        <Route path="/" element={<Main />}>
          <Route index element={<Home />} />
          <Route path="/user/home" element={<BookCatalog />} />
          <Route path="/user/book/:bookId" element={<BookDetails />} />
          <Route path="/user/cart" element={<ShoppingCart/>}/>
          <Route path="/user/payment" element={<Payment/>}/>
          <Route path="/user/orderdetails" element={<Invoice/>}/>
          <Route path="/user/profile/*" element={<ProfileDashboard/>}/>
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="book" element={<Book />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Route>

        {/* Default & Fallback */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;