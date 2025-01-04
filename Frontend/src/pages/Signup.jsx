import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Simplified password validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const dataToStore = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        about: "Edit Your description",
        image: "https://cdn-icons-png.flaticon.com/512/10398/10398223.png",
        social: {
          twitter: `${formData.name}@twitter`,
          instagram: `${formData.name}@instagram`,
          linkedin: `${formData.name}@linkedin`,
          github: `${formData.name}@github`,
        },
      };
      localStorage.setItem('userData', JSON.stringify(dataToStore));
      navigate('/');
    }
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
                color: '#0f0'
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
                animationDelay: `${i * 1.5}s`
              }}
            >
              🔒
            </div>
          ))}
        </div>

        {/* Glowing Circuit Lines */}
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-10">
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 0 50 L 100 50 M 50 0 L 50 100" stroke="#00ff00" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="3" fill="#00ff00" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-md w-full space-y-8 bg-gray-800/90 p-8 rounded-xl shadow-2xl backdrop-blur-sm relative z-10">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🛡️</div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Join CyberEdu
          </h2>
          <p className="text-cyan-400">
            Begin your cybersecurity learning journey
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="text-white">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-700/50 border-transparent focus:border-cyan-500 focus:bg-gray-900 focus:ring-0 text-white backdrop-blur-sm transition-all"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

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
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-700/50 border-transparent focus:border-cyan-500 focus:bg-gray-900 focus:ring-0 text-white backdrop-blur-sm transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
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
              className="w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 transform hover:scale-105"
            >
              Start Your Journey
            </button>
          </div>
        </form>
      </div>

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

export default Signup;