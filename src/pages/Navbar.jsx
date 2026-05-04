import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../stores/user_slice';

import { IoHomeOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";



const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/auth?mode=login');
  };

  return (
    <nav className="fixed left-0 top-0 w-20 h-screen bg-gray-900 text-white flex flex-col z-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-white">CB</h2>
      </div>

      {/* Menu Items */}
      <ul className="flex-1 flex flex-col list-none p-0 m-0">
        {!user ? (
          // Not logged in - show only Login
          <>
            <li>
              <NavLink
                to="/auth?mode=login"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-4 text-white no-underline hover:bg-gray-800 transition-colors ${isActive ? ' font-medium' : ''
                  }`
                }
              >
                <span className="text-xl">🔑</span>
                {/* Login */}
              </NavLink>
            </li>
          </>
        ) : (
          // Logged in - show Dashboard and Logout
          <>
            {/* Dashboard Link */}
            <div className='flex flex-col items-center'>
              <li className=''>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center py-4 text-white  no-underline hover:bg-gray-800 transition-colors ${isActive ? ' font-medium' : ''
                    }`
                  }
                >
                  <IoHomeOutline className='text-2xl' />
                </NavLink>
              </li>

              <li className=''>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center py-4 text-white no-underline hover:bg-gray-800 transition-colors ${isActive ? ' font-medium' : ''
                    }`
                  }
                >
                  <IoHomeOutline className='text-2xl' />
                </NavLink>
              </li>
            </div>

            {/* Logout Button */}

            <div className='flex flex-col items-center'>
              <li className="mt-auto ">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center py-4 text-white hover:bg-gray-800 transition-colors border-none bg-transparent cursor-pointer text-base"
                >
                  <IoIosLogOut className='text-2xl' />
                </button>
              </li>
            </div>

          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;