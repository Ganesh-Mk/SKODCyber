import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { initializeAuth } from "./utils/authUtils"; // Import initialization
import "./App.css";
import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Account from "./pages/Account";
import Navbar from "./Components/Navbar";
import News from "./pages/News";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Community from "./pages/Community";
import UserProfilePage from "./pages/Userprofile";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import BlogDetailPage from "./pages/BlogDetailPage";

const App = () => {
  useEffect(() => {
    // Initialize authentication on app load
    initializeAuth();
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/learn"
            element={
              <ProtectedRoute>
                <Learn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/news"
            element={
              <ProtectedRoute>
                <News />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog/:blogId"
            element={
              <ProtectedRoute>
                <BlogDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/:userId"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
