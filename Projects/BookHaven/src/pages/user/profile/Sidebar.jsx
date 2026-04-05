// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { useProfile } from '../context/ProfileContext';

// const Sidebar = () => {
//   const { userData, profileData, loading } = useProfile();

//   const userName = userData?.name || (loading ? "Loading..." : "Guest");
//   const userProfileImage = profileData?.imageBase64
//     ? `data:image/jpeg;base64,${profileData.imageBase64}`
//     : "https://placehold.co/100x100?text=User";

//   return (
//     <div className="bg-dark text-white p-3 vh-100 d-flex flex-column justify-content-between shadow-sm border-end border-secondary">
//       <div>
//         {/* Navigation */}
//         <nav className="nav flex-column">
//           <NavLink
//             to="/user/profile"
//             className={({ isActive }) =>
//               `nav-link text-white py-2 px-3 rounded ${isActive ? 'bg-secondary' : 'hover-bg'}`
//             }
//           >
//             <i className="bi bi-person me-2"></i> Profile
//           </NavLink>

//           <NavLink
//             to="/user/profile/orders"
//             className={({ isActive }) =>
//               `nav-link text-white py-2 px-3 rounded ${isActive ? 'bg-secondary' : 'hover-bg'}`
//             }
//           >
//             <i className="bi bi-bag-check me-2"></i> Orders
//           </NavLink>

//           <NavLink
//             to="/user/profile/settings"
//             className={({ isActive }) =>
//               `nav-link text-white py-2 px-3 rounded ${isActive ? 'bg-secondary' : 'hover-bg'}`
//             }
//           >
//             <i className="bi bi-gear me-2"></i> Settings
//           </NavLink>
//         </nav>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;



import React from 'react';
import { NavLink } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';

const Sidebar = () => {
  const { userData, profileData, loading } = useProfile();

  const userName = userData?.name || (loading ? "Loading..." : "Guest");
  const userProfileImage = profileData?.imageBase64
    ? `data:image/jpeg;base64,${profileData.imageBase64}`
    : "https://placehold.co/100x100?text=User";

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="d-none d-md-flex bg-dark text-white p-3 vh-100 flex-column justify-content-between shadow-sm border-end border-secondary">
        <div>
          <nav className="nav flex-column">
            <NavLink
              to="/user/profile"
              className={({ isActive }) =>
                `nav-link text-white py-2 px-3 rounded ${isActive ? 'bg-secondary' : 'hover-bg'}`
              }
            >
              <i className="bi bi-person me-2"></i> Profile
            </NavLink>

            <NavLink
              to="/user/profile/orders"
              className={({ isActive }) =>
                `nav-link text-white py-2 px-3 rounded ${isActive ? 'bg-secondary' : 'hover-bg'}`
              }
            >
              <i className="bi bi-bag-check me-2"></i> Orders
            </NavLink>

            <NavLink
              to="/user/profile/settings"
              className={({ isActive }) =>
                `nav-link text-white py-2 px-3 rounded ${isActive ? 'bg-secondary' : 'hover-bg'}`
              }
            >
              <i className="bi bi-gear me-2"></i> Settings
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="d-flex d-md-none bg-dark text-white py-2 px-3 justify-content-around border-top border-secondary">
        <NavLink
          to="/user/profile"
          className={({ isActive }) =>
            `nav-link text-white px-2 text-center ${isActive ? 'text-info' : ''}`
          }
        >
          <i className="bi bi-person fs-4"></i>
        </NavLink>
        <NavLink
          to="/user/profile/orders"
          className={({ isActive }) =>
            `nav-link text-white px-2 text-center ${isActive ? 'text-info' : ''}`
          }
        >
          <i className="bi bi-bag-check fs-4"></i>
        </NavLink>
        <NavLink
          to="/user/profile/settings"
          className={({ isActive }) =>
            `nav-link text-white px-2 text-center ${isActive ? 'text-info' : ''}`
          }
        >
          <i className="bi bi-gear fs-4"></i>
        </NavLink>
      </div>
    </>
  );
};

export default Sidebar;
