import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../store/userSlice.js";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, X } from "lucide-react";
import axios from "axios";
import OtpSendEmail from "../utils/otpSendingEmail.js";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Forgot password states
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotEmailError, setForgotEmailError] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otpNumber, setOtpNumber] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await axios.post(`${BACKEND_URL}/login`, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.data.success) {
          // Store user data and token
          const userData = response.data.user;
          const token = response.data.token;

          dispatch(login(userData));
          localStorage.setItem("userData", JSON.stringify(userData));
          localStorage.setItem("token", token); // Store JWT token

          // Set default axios authorization header
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Redirect to home
          navigate("/");
        }
      } catch (error) {
        console.error("Login error:", error);
        setLoginError(
          error.response?.data?.message || "Failed to login. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    setLoginError("");
  };

  // Generate random 4-digit OTP
  const generateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setOtpNumber(otp);
    return otp;
  };

  // Handle forgot password email submission
  const handleForgotEmailSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!forgotEmail) {
      setForgotEmailError("Email is required");
      return;
    }

    if (!emailRegex.test(forgotEmail)) {
      setForgotEmailError("Please enter a valid email");
      return;
    }

    setForgotEmailError("");
    const otp = generateOTP();

    const templateParams = {
      to_email: forgotEmail,
      otpnumber: otp,
    };

    try {
      await OtpSendEmail(templateParams);
      console.log("Email sent successfully!");
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
    }

    setIsEmailSent(true);
  };

  // Handle OTP verification
  const handleVerifyOTP = (e) => {
    e.preventDefault();

    if (!userOtp) {
      setOtpError("Please enter the OTP");
      return;
    }

    if (userOtp !== otpNumber) {
      setOtpError("Invalid OTP. Please try again.");
      return;
    }

    setOtpError("");
    setIsOtpVerified(true);
  };

  // Handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      setNewPasswordError("Please enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      setNewPasswordError("Password must be at least 6 characters");
      return;
    }

    setNewPasswordError("");
    setIsResetting(true);

      try {
        const response = await fetch(`${BACKEND_URL}/resetPassword`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: forgotEmail,
            newPassword,
          }),
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.message || "Failed to reset password");
        }

      setResetSuccess(true);

      setTimeout(() => {
        setShowForgotPasswordModal(false);
        setForgotEmail("");
        setUserOtp("");
        setNewPassword("");
        setIsEmailSent(false);
        setIsOtpVerified(false);
        setResetSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Reset password error:", error);
      setNewPasswordError(
        error.message || "Failed to reset password. Please try again."
      );
    } finally {
      setIsResetting(false);
    }
  };

  const resetForgotPasswordState = () => {
    setForgotEmail("");
    setForgotEmailError("");
    setIsEmailSent(false);
    setOtpNumber("");
    setUserOtp("");
    setOtpError("");
    setIsOtpVerified(false);
    setNewPassword("");
    setNewPasswordError("");
    setResetSuccess(false);
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
    resetForgotPasswordState();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Binary Rain Animation */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="binary-rain"
              style={{
                left: `${i * 5}%`,
                animationDelay: `${i * 0.3}s`,
                color: "#0f0",
              }}
            >
              01001010
            </div>
          ))}
        </div>

        {/* Floating Security Icons */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="security-icon"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 1.5}s`,
              }}
            >
              🔒
            </div>
          ))}
        </div>

        {/* Glowing Circuit Lines */}
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-10">
            <pattern
              id="circuit"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 0 50 L 100 50 M 50 0 L 50 100"
                stroke="#00ff00"
                strokeWidth="0.5"
              />
              <circle cx="50" cy="50" r="3" fill="#00ff00" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-md w-full space-y-4 bg-gray-800/90 p-8 mt-10 rounded-xl shadow-2xl backdrop-blur-sm relative z-10">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🔐</div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-cyan-400">
            Login to continue your learning journey
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {loginError && (
            <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
              {loginError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-white">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-700/50 border-transparent focus:border-cyan-500 focus:bg-gray-900 focus:ring-0 text-white backdrop-blur-sm transition-all"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="text-white">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-700/50 border-transparent focus:border-cyan-500 focus:bg-gray-900 focus:ring-0 text-white backdrop-blur-sm transition-all pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </div>

          <div className="flex justify-between text-sm">
            <button
              type="button"
              onClick={() => setShowForgotPasswordModal(true)}
              className="text-cyan-400 hover:text-cyan-300"
            >
              Forgot password?
            </button>

            <a href="/signup" className="text-cyan-400 hover:text-cyan-300">
              Don't have an account? Sign up
            </a>
          </div>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={closeForgotPasswordModal}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🔑</div>
              <h3 className="text-xl font-bold text-white">
                {resetSuccess
                  ? "Password Reset Successfully!"
                  : isOtpVerified
                  ? "Set New Password"
                  : isEmailSent
                  ? "Enter OTP"
                  : "Forgot Password"}
              </h3>
              <p className="text-gray-300 text-sm mt-1">
                {resetSuccess
                  ? "You can now login with your new password"
                  : isOtpVerified
                  ? "Create a new secure password"
                  : isEmailSent
                  ? "Enter the 4-digit code sent to your email"
                  : "Enter your email to reset the code"}
              </p>
            </div>

            {!resetSuccess && (
              <>
                {!isEmailSent ? (
                  <form
                    onSubmit={handleForgotEmailSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <label htmlFor="forgotEmail" className="text-white">
                        Email address
                      </label>
                      <input
                        id="forgotEmail"
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => {
                          setForgotEmail(e.target.value);
                          setForgotEmailError("");
                        }}
                        className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-700/50 border-transparent focus:border-cyan-500 focus:bg-gray-900 focus:ring-0 text-white backdrop-blur-sm transition-all"
                        placeholder="you@example.com"
                      />
                      {forgotEmailError && (
                        <p className="mt-1 text-red-500 text-sm">
                          {forgotEmailError}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all"
                    >
                      Send OTP
                    </button>
                  </form>
                ) : !isOtpVerified ? (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div>
                      <label htmlFor="otp" className="text-white">
                        Enter 4-digit OTP
                      </label>
                      <div className="mt-2 flex justify-center gap-2">
                        <input
                          id="otp"
                          type="text"
                          maxLength={4}
                          value={userOtp}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            setUserOtp(value);
                            setOtpError("");
                          }}
                          className="block w-full px-4 py-3 rounded-lg bg-gray-700/50 border-transparent focus:border-cyan-500 focus:bg-gray-900 focus:ring-0 text-white text-center text-xl tracking-widest"
                          placeholder="Enter OTP"
                        />
                      </div>
                      {otpError && (
                        <p className="mt-1 text-red-500 text-sm text-center">
                          {otpError}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all"
                    >
                      Verify OTP
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          generateOTP();
                          console.log(`New OTP generated: ${otpNumber}`);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 text-sm"
                      >
                        Resend OTP
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label htmlFor="newPassword" className="text-white">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            setNewPasswordError("");
                          }}
                          className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-700/50 border-transparent focus:border-cyan-500 focus:bg-gray-900 focus:ring-0 text-white backdrop-blur-sm transition-all pr-12"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                      {newPasswordError && (
                        <p className="mt-1 text-red-500 text-sm">
                          {newPasswordError}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isResetting}
                      className="w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isResetting ? "Resetting..." : "Reset Password"}
                    </button>
                  </form>
                )}
              </>
            )}

            {resetSuccess && (
              <div className="mt-4">
                <button
                  onClick={closeForgotPasswordModal}
                  className="w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .binary-rain {
          position: absolute;
          top: -20px;
          font-family: monospace;
          animation: rain 15s linear infinite;
          opacity: 0.5;
        }

        @keyframes rain {
          0% { transform: translateY(-20px); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        .security-icon {
          position: absolute;
          font-size: 24px;
          animation: float 10s ease-in-out infinite;
          opacity: 0.3;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;
