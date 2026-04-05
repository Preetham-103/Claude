import "./AdminSidebar.css";
import { NavLink } from "react-router-dom";
import { BookOpen, ShoppingCart, Users, BarChart2, Settings, Home } from "lucide-react";

const AdminSidebar = () => {
  const navItems = [
    { label: "Dashboard", icon: Home, path: "/admin/dashboard" },
    { label: "Book", icon: BookOpen, path: "/admin/book" },
    { label: "Orders", icon: ShoppingCart, path: "/admin/orders" },
    { label: "Customers", icon: Users, path: "/admin/customers" },
    { label: "Analytics", icon: BarChart2, path: "/admin/analytics" },
    { label: "User Page", icon: Home, path: "/" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="admin-sidebar d-none d-md-flex flex-column">
        <h1 className="sidebar-title">Bookstore Admin</h1>
        <nav className="sidebar-nav">
          {navItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Nav - Sticky Below AdminNavbar */}
      <div className="admin-bottom-nav d-flex d-md-none bg-dark text-white py-2 px-3 pt-2 justify-content-around fixedTop border-top border-secondary w-100">
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `nav-link text-white px-2 text-center ${isActive ? "text-info" : ""}`
            }
          >
            <Icon size={22} />
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default AdminSidebar;