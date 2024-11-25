import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../utils/auth";

import "./Signup.css";

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await signup(formData);

    if (response.success) {
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setMessage(response.message);
    }

    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <div className="auth-div">
    <center><h1 className="title-txt">CONTACT BOOK</h1></center>
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Signup</h1>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
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
        <button type="submit">Signup</button>
        {message && <p className="message">{message}</p>}
        <p className="switch-link" onClick={() => navigate("/login")}>
          Already have an account? Login
        </p>
      </form>
    </div>
    </div>
  );
};

export default SignupPage;
