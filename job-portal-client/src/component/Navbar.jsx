import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { auth } from '../firebase/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import ProfileDropdown from "./ProfileDropdown";

// CSS
import { FaBarsStaggered, FaXmark, FaUser, FaComments, FaBell } from "react-icons/fa6";

const Navbar = () => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { userLoggedIn, currentUser } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEmployer, setIsEmployer] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          console.log('Claims:', idTokenResult.claims);  // Debugging line
          setIsAdmin(!!idTokenResult.claims.admin);
          setIsEmployer(!!idTokenResult.claims.role && idTokenResult.claims.role === 'employer');
          console.log('isAdmin:', !!idTokenResult.claims.admin);  // Debugging line
          console.log('isEmployer:', !!idTokenResult.claims.role && idTokenResult.claims.role === 'employer');  // Debugging line
        } catch (error) {
          console.error('Error fetching token:', error);
        }
      } else {
        setIsAdmin(false);
        setIsEmployer(false);
      }
      setIsDropdownOpen(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDropdownToggler = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuToggler = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const navItems = [];

  if (isAdmin) {
    navItems.push(
      {path: "/", title: "See & Find Work"},
      {path: "/post-job", title: "Post a Job"},
      {path: "/admin", title: "Admin"});
  } else if (isEmployer) {
    navItems.push(
      {path: "/", title: "See & Find Work"},
      {path: "/post-job", title: "Post a Job"},
      {path: "/dashboard", title: "Dashboard"});
  };

  return (
    <header className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <nav className="flex justify-between items-center py-6">
        <a href="/" className="flex items-center gap-2 text-2xl text-black">
          {/* Logo */}
          <svg
            xmlns='http:www.w3.org/2000/svg'
            width='29'
            height='30'
            viewBox='0 0 29 30'
            fill='none'
          >
            <circle
              cx='12.0143'
              cy='12.5143'
              r='12.0143'
              fill='#56E39F'
              fillOpacity='0.4'  
            />
            <circle 
              cx='16.9857'
              cy='17.4857'
              r='12.0143'
              fill='#56E39F'
            />
          </svg>
          <span>Job Portal</span>
          {/* add role tags to logo */}
          <span className='flex items-baseline mt-2'>
            {isAdmin && (<p className="text-blue text-sm">admin</p>)}
            {isEmployer && (<p className="text-aqua text-sm">employer</p>)}
          </span>
          {/* Logo end */}
        </a>

        {/* Navitems for large devices */}
        <ul className="hidden md:flex gap-12">
          {navItems.map(({ path, title }) => (
            <li key={path} className="text-base text-primary">
              {/* Handles link redirections */}
              <NavLink to={path} className={({ isActive }) => (isActive ? 'active' : '')}>
                {title}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* conditionally render Sign Out or Login/Sign Up based on userLoggedIn status */}
        <div className="text-base text-primary font-medium space-x-5 hidden lg:flex items-center relative">
          {userLoggedIn ? (
            <div className="relative md:flex gap-8">
              {/* icons */}
              <button className="w-8 h-8 flex items-center justify-center">
                <FaComments className="text-primary/90 w-6 h-6 hover:fill-blue" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center">
                <FaBell className="text-primary/90 w-5 h-5 hover:fill-blue" />
              </button>
              <button onClick={handleDropdownToggler} className="w-8 h-8 flex items-center justify-center">
                <FaUser className="text-primary/90 w-5 h-5 hover:fill-blue" />
              </button>
              <ProfileDropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)} handleSignOut={handleSignOut} currentUser={currentUser} />
            </div>
          ) : (
            <>
              <Link to="/login" className="py-2 px-5 border rounded">
                Log in
              </Link>
              <Link to="/register" className="py-2 px-5 border rounded bg-blue text-white hover:bg-midnight-green">
                Sign Up
              </Link> 
              <p className='text-gray-400'>|</p>
              <Link to="/employer-login" className="text-base text-primary py-2 hover:text-aqua">
                Employer
              </Link>
            </>
          )}

        </div>

        {/* Mobile menu */}
        <div className="md:hidden block">
          <button onClick={handleMenuToggler}>
            {isMenuOpen ? <FaXmark className="w-5 h-5 text-primary" /> : <FaBarsStaggered className="w-5 h-5 text-primary" />}
          </button>
        </div>
      </nav>

      {/* Navitems for mobile */}
      <div className={`px-4 bg-black py-5 rounded-sm ${isMenuOpen ? '' : 'hidden'}`}>
        <ul>
          {navItems.map(({ path, title }) => (
            <li key={path} className="text-base text-white py-1">
              <NavLink to={path} className={({ isActive }) => (isActive ? 'active' : '')}>
                {title}
              </NavLink>
            </li>
          ))}
          {isAdmin && <li className="text-base text-white py-1">Admin</li>}
          {userLoggedIn ? (
            <li className="text-white py-1">
              <button onClick={handleSignOut}>Sign Out</button>
            </li>
          ) : (
            <li className="text-white py-1">
              <Link to="/login">Log in</Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Navbar