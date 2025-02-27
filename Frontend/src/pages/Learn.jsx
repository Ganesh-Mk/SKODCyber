import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LearningPage = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedRole, setSelectedRole] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [selectedRole, searchQuery, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BACKEND_URL}/allCourse`);
      setCourses(response.data);
    } catch (error) {
      setError(error.message || 'Failed to fetch courses');
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];
    if (selectedRole !== 'all') {
      filtered = filtered.filter(course => course.role === selectedRole);
    }
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredCourses(filtered);
  };

  const navigateToModules = (courseId) => {
    navigate(`/modules/${courseId}`);
  };

  const renderCourseCard = (course, index) => (
    <motion.div
      key={course._id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.43, 0.13, 0.23, 0.96]
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-300 shadow-lg hover:shadow-cyan-400/20 h-[380px] flex flex-col"
    >

      <div className="relative h-40 flex-shrink-0">
        <motion.img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-2">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="text-lg font-semibold text-gray-100 line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300 h-12"
          >
            {course.title}
          </motion.h3>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="px-2 py-1 bg-gray-700/50 backdroMp-blur-sm rounded-full text-xs font-medium text-cyan-400 border border-gray-600/50 whitespace-nowrap flex-shrink-0"
          >
            {course.role}
          </motion.span>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.4 }}
          className="text-gray-400 line-clamp-2 text-xs leading-relaxed flex-grow mb-3"
        >
          {course.description}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.5 }}
          onClick={() => navigateToModules(course._id)}
          className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-base font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-cyan-500/25 mt-auto"
        >
          View Modules
        </motion.button>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-16 md:pt-0">
      <div className="max-w-7xl mx-auto space-y-8 p-4">
        {/* Added Courses heading at the top left */}
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold text-white"
        >
          Courses
        </motion.h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-500">
            {error}
            <button
              onClick={fetchCourses}
              className="ml-4 text-sm underline hover:text-red-400"
            >
              Try again
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
          >
            All Courses
          </motion.h2>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <motion.input
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              type="text"
              placeholder="Search courses..."
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none text-gray-200 w-full md:w-64 transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <motion.select
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none text-gray-200 w-full md:w-auto transition-all duration-300"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="developer">Developer</option>
              <option value="user">User</option>
            </motion.select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* API fetched courses */}
          {filteredCourses.length > 0 && filteredCourses.map((course, index) =>
            renderCourseCard(course, index + course.length)
          )}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No courses found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPage;