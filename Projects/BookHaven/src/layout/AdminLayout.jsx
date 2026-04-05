import AdminNavbar from "../components/Navbar/AdminNavbar";
import AdminSidebar from "../components/Sidebar/AdminSidebar";
import { Outlet } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <AdminNavbar />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;