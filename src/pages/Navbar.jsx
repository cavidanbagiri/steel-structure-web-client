import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../stores/user_slice';

import { IoHomeOutline } from "react-icons/io5";
import { CiViewTable } from "react-icons/ci";
import { CiDeliveryTruck } from "react-icons/ci";
import { BsTruck } from "react-icons/bs";
import { PiCraneTowerLight } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";





import { IoIosLogOut } from "react-icons/io";
import { div } from 'framer-motion/client';



const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {

    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (confirmLogout) {
      dispatch(logout());
      dispatch(reset());
      navigate('/auth?mode=login');
    }
  };

  return (
    <nav className="fixed left-0 top-0 w-16 h-screen bg-gray-900 text-white flex flex-col z-50 rounded-xl">
      {/* Header */}
      <div className="flex flex-row items-center justify-center py-4 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-white ">ST</h2>
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
          <div className='flex flex-col justify-between h-full'>

            <div className='flex flex-col items-center w-full'>
              <div className='flex flex-col w-full items-center '>
                <li className='flex w-full'>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `flex items-center justify-center py-4 text-white w-full no-underline hover:bg-gray-800  transition-colors ${isActive ? ' font-medium' : ''}`
                    }
                  >
                    <RxDashboard className='text-2xl' />
                  </NavLink>
                </li>

                <li className='flex w-full'>
                  <NavLink
                    to="/home"
                    className={({ isActive }) =>
                      `flex items-center justify-center py-4 text-white w-full no-underline hover:bg-gray-800  transition-colors ${isActive ? ' font-medium' : ''}`
                    }
                  >
                    <IoHomeOutline className='text-2xl' />
                  </NavLink>
                </li>

                <li className='flex w-full items-center '>
                  <NavLink
                    to="/main"
                    className={({ isActive }) =>
                      `flex flex-row items-center justify-center py-4 text-white w-full  no-underline hover:bg-gray-800 transition-colors ${isActive ? ' font-medium' : ''}`
                    }
                  >
                    <CiViewTable className='text-2xl' />
                  </NavLink>
                </li>


                <li className='flex w-full items-center '>
                  <NavLink
                    to="/transport"
                    className={({ isActive }) =>
                      `flex flex-row items-center justify-center py-4 text-white w-full  no-underline hover:bg-gray-800 transition-colors ${isActive ? ' font-medium' : ''}`
                    }
                  >
                    <BsTruck className='text-xl' />
                  </NavLink>
                </li>
                <li className='flex w-full items-center '>
                  <NavLink
                    to="/erected"
                    className={({ isActive }) =>
                      `flex flex-row items-center justify-center py-4 text-white w-full  no-underline hover:bg-gray-800 transition-colors ${isActive ? ' font-medium' : ''}`
                    }
                  >
                    <PiCraneTowerLight className='text-2xl' />
                  </NavLink>
                </li>
              </div>
            </div>

            <div className='flex flex-col items-center w-full'>
              <li className="mt-auto w-full mb-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center py-4 text-white hover:bg-gray-800 transition-colors border-none bg-transparent cursor-pointer text-base"
                >
                  <IoIosLogOut className='text-2xl' />
                </button>
              </li>
            </div>

          </div>

        )}
      </ul>
    </nav>
  );
};

export default Navbar;