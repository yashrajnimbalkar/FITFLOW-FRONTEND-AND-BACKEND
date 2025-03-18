import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import TopBar from "./components/TopBar";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import MyGoals from "./pages/MyGoals";
import Schedule from "./pages/Schedule";
import Achievements from "./pages/Achievements";
import Statistics from "./pages/Statistics";
import FitnessForm from "./pages/FitnessForm";
import NutritionForm from "./pages/NutritionForm";
import Community from "./pages/Community";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./components/CreatePost";
import ProfileView from "./pages/ProfileView";
import MindfulMoments from "./pages/MindfulMoments";
import { DataProvider } from "./context/DataContext";
import Auth from "./pages/Auth"; // New Auth component for Login/Signup scroll effect
import LoadingSpinner from "./components/LoadingSpinner"; // Add a loading spinner component
import Signin from "./pages/Signin"; // Import Signin component
import Signup from "./pages/Signup"; // Import Signup component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [userData, setUserData] = useState(null); // Store user data after login
  const [isLoading, setIsLoading] = useState(true); // Track initial loading state

  // Check for existing user data on app load (e.g., from localStorage)
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
      setIsLoggedIn(true);
    }
    setIsLoading(false); // Set loading to false after checking
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle login
  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUserData(user); // Set user data (e.g., username, email, height, weight, etc.)
    localStorage.setItem("userData", JSON.stringify(user)); // Persist user data
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null); // Clear user data
    localStorage.removeItem("userData"); // Remove user data from localStorage
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingSpinner />; // Use a loading spinner component
  }

  return (
    <Router>
      <DataProvider>
        <div>
          {/* Pass authentication state and functions to TopBar */}
          <TopBar isLoggedIn={isLoggedIn} userData={userData} handleLogout={handleLogout} />
          <Routes>
            {/* Default route redirects to Signin */}
            <Route path="/" element={<Navigate to="/signin" />} />

            {/* Auth route for Login/Signup */}
            <Route path="/auth" element={<Auth handleLogin={handleLogin} />} />

            {/* Signin and Signup routes */}
            <Route path="/signin" element={<Signin handleLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup handleLogin={handleLogin} />} />

            {/* Protected routes (only accessible if logged in) */}
            <Route
              path="/dashboard"
              element={isLoggedIn ? <Dashboard userData={userData} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/services"
              element={
                isLoggedIn ? (
                  <Services
                    isLoggedIn={isLoggedIn} // Pass isLoggedIn to Services
                    userData={userData} // Pass userData to Services
                    isServicesInView={true} // Indicate that Services is in view
                  />
                ) : (
                  <Navigate to="/signin" />
                )
              }
            />
            <Route
              path="/mindful-moments"
              element={isLoggedIn ? <MindfulMoments userData={userData} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/goals"
              element={isLoggedIn ? <MyGoals userData={userData} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/schedule"
              element={isLoggedIn ? <Schedule userData={userData} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/achievements"
              element={isLoggedIn ? <Achievements userData={userData} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/statistics"
              element={isLoggedIn ? <Statistics userData={userData} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/fitness"
              element={isLoggedIn ? <FitnessForm userData={userData} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/nutrition"
              element={isLoggedIn ? <NutritionForm userData={userData} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/community"
              element={isLoggedIn ? <Community userData={userData} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/profile"
              element={isLoggedIn ? <ProfileView userData={userData} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/post/:id"
              element={isLoggedIn ? <PostDetail userData={userData} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/create-post"
              element={isLoggedIn ? <CreatePost userData={userData} /> : <Navigate to="/signin" />}
            />

            {/* 404 Not Found Route */}
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </div>
      </DataProvider>
    </Router>
  );
}

export default App;