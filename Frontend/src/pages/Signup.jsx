import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/userSlice.js';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.role) newErrors.role = 'Role is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:3000/signup", 
          formData,
          { 
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          const userData = response.data.user;
          dispatch(login(userData));
          localStorage.setItem('userData', JSON.stringify(userData));
          navigate('/');
        }
      } catch (error) {
        console.error("Signup error:", error);
        setServerError(
          error.response?.data?.message || 
          "Failed to register. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center mt-10 justify-center p-6 relative overflow-hidden">
      <div className="max-w-md w-full space-y-8 bg-gray-800/90 p-8 rounded-xl shadow-2xl backdrop-blur-sm relative z-10">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🛡️</div>
          <h2 className="text-3xl font-bold text-white mb-2 flex gap-2 items-center justify-center">
            Join
            <span className="text-3xl font-bold">
              <span className="text-purple-400">SKOD</span>
              <span className="text-indigo-400">Cyber</span>
            </span>
          </h2>
          <p className="text-cyan-400">Begin your cybersecurity learning journey</p>
        </div>

        {serverError && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
            {serverError}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="text-white block mb-1">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-700/50 border-transparent focus:border-cyan-500 focus:bg-gray-900 focus:ring-0 text-white"
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="text-white block mb-1">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-700/50 border-transparent focus:border-cyan-500 focus:bg-gray-900 focus:ring-0 text-white"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="relative">
              <label htmlFor="password" className="text-white block mb-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-700/50 border-transparent focus:border-cyan-500 focus:bg-gray-900 focus:ring-0 text-white pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="role" className="text-white block mb-1">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-700/50 border-transparent focus:border-cyan-500 focus:bg-gray-900 focus:ring-0 text-white"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="developer">Developer</option>
              </select>
              {errors.role && <p className="mt-1 text-red-500 text-sm">{errors.role}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Start Your Journey'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;