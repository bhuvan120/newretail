import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuth(localStorage.getItem("isAuthenticated") === "true");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuth(false);
    navigate("/");
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Admin", path: "/admin" },
    { name: "Products", path: "/productscard" }, // Public products page
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-slate-100 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <ShoppingBag size={20} />
              </div>
              <span className="font-bold text-xl text-slate-800">Vajra Retails</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? "text-blue-600" : "text-slate-600 hover:text-blue-600"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
              {!isAuth ? (
                <>
                  <Link
                    to="/signup"
                    className="text-slate-600 hover:text-blue-600 font-medium text-sm"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Log In
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Log Out
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 absolute w-full shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="border-t border-slate-100 mt-4 pt-4 px-3 flex flex-col gap-3">
              {!isAuth ? (
                <>
                  <Link to="/signup" onClick={closeMenu} className="w-full text-center py-2 border border-slate-200 rounded-lg text-slate-600">Sign Up</Link>
                  <Link to="/login" onClick={closeMenu} className="w-full text-center py-2 bg-blue-600 text-white rounded-lg">Log In</Link>
                </>
              ) : (
                <button onClick={handleLogout} className="w-full text-center py-2 bg-rose-50 text-rose-600 rounded-lg">Log Out</button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
