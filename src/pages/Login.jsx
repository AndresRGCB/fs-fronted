import { useNavigate } from "react-router-dom"; // Import navigate
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";
import "../styles/login.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
console.log("🔗 API Base URL:", process.env.REACT_APP_API_BASE_URL);


const Login = () => {
  const navigate = useNavigate(); // Initialize navigation

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign-Up Form State
  const [name, setName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toggle between forms
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => {
    setIsLogin((prev) => !prev);

    // Clear Fields on Toggle
    setLoginEmail("");
    setLoginPassword("");
    setName("");
    setSignUpEmail("");
    setSignUpPassword("");
    setConfirmPassword("");
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: signUpEmail,
          password: signUpPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully! Redirecting to login...");
        handleLogin(signUpEmail, signUpPassword); // ✅ Log in after signup
      } else {
        alert(`Registration failed: ${data.detail || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error during signup:", err);
      alert("Error connecting to the server. Please try again.");
    }
  };

  const handleLogin = async (email, password) => {
    try {

        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // ✅ Decode the JWT token to verify user_id
            const tokenParts = data.access_token.split("."); // JWT has 3 parts: Header, Payload, Signature
            const decodedPayload = JSON.parse(atob(tokenParts[1])); // Base64 decode payload

            // ✅ Store token & user_id in localStorage
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user_id", decodedPayload.user_id); // 🔥 Store user_id from decoded JWT

            navigate("/home"); // ✅ Redirect to home after successful login
        } else {
            alert("Login failed: " + data.detail);
        }
    } catch (err) {
        console.error("Error during login:", err);
        alert("Error during login. Please try again.");
    }
};



  const handleLoginSubmit = (e) => {
    e.preventDefault();  // ✅ Prevents automatic page refresh
    handleLogin(loginEmail, loginPassword);
  };

  return (
    <div className="login-container">
      <div className="left-column">
        <img src="/logo.png" alt="Logo" className="logo" />

        <div className="form-wrapper">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="form-container"
              >
                <LoginForm
                  email={loginEmail} setEmail={setLoginEmail}
                  password={loginPassword} setPassword={setLoginPassword}
                  handleSubmit={handleLoginSubmit}
                  toggleForm={toggleForm}
                />
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="form-container"
              >
                <SignUpForm
                  name={name} setName={setName}
                  email={signUpEmail} setEmail={setSignUpEmail}
                  password={signUpPassword} setPassword={setSignUpPassword}
                  confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                  handleSubmit={handleSignUpSubmit}
                  toggleForm={toggleForm}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="right-column">
        <div className="right-column-wrapper">
          <img src="/4575-removebg.png" alt="Illustration" className="right-column-image" />
        </div>
      </div>
    </div>
  );
};

export default Login;
