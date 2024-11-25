import React from "react";
import './Navbar.css';

const Navbar = ({ auth, onLogout }) => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <h1>ContactBook</h1>
      </div>
      <div className="navbar-right">
        <span className="user-name">Welcome, {auth.user?.name || "User"}!</span>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
