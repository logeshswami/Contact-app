import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../utils/auth";

import "./Signup.css";

const LoginPage = ({ setAuth }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login(formData);
    console.log(response);

    if (response.success) {
      setMessage("Login successful!");
      setAuth({ isAuth: true, user: response.userData }); // Set authentication state
      navigate("/home"); // Redirect to the home page
    } else {
      setMessage(response.message); // Show error message
    }
  };

  return (
  <div className="auth-div">
      <center><h1 className="title-txt">CONTACT BOOK</h1></center>
      <div className="auth-container">
      
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>Login</h1>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
          {message && <p className="message">{message}</p>}
          <p className="switch-link" onClick={() => navigate("/signup")}>
            Don't have an account? Signup
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
