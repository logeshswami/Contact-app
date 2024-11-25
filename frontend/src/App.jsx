import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/contact_page/home";
import LoginPage from "./components/login_page/login";
import SignupPage from "./components/login_page/signup";

const App = () => {
  const [auth, setAuth] = useState({
    isAuth: false,
    user: null,
  });
  const [loading, setLoading] = useState(true); // to delay render after load

  // load auth data from LocalStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      console.log(storedAuth)
      const parsedAuth = JSON.parse(storedAuth);
      setAuth(parsedAuth);  
    }
    setLoading(false); 
  }, []);

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (auth.isAuth) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth");
    }
  }, [auth]);

  // Logout function
  const handleLogout = () => {
    setAuth({ isAuth: false, user: null });
    localStorage.removeItem("auth");
  };

  
  if (loading) {
    return <div><center><h1>Loading...</h1></center></div>; 
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={auth.isAuth ? <Navigate to="/home" /> : <Navigate to="/login" />}
        />
        <Route path="/login"
          element={auth.isAuth ? <Navigate to="/home" /> : <LoginPage setAuth={setAuth} />}
        />
        <Route path="/signup"  element={auth.isAuth ? <Navigate to="/home" /> : <SignupPage />}/>
        
        <Route
          path="/home"
          element={
            <PrivateRoute auth={auth}>
              <HomePage auth={auth} setAuth={setAuth} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

//private route for secure paths
function PrivateRoute({ auth, children }) {
  console.log("privateroute",auth)
  if (!auth || !auth.isAuth) {
    return <Navigate to="/login" />; 
  }
  return children; 
}

export default App;
