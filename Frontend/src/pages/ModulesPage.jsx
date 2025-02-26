import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const ModulesPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const thumbnailRefs = useRef({});

  useEffect(() => {
    fetchCourseAndModules();
  }, [courseId]);

  // Generate thumbnails from videos when modules are loaded

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BACKEND_URL}/allCourse`);      
      setCourses(response.data);
    } catch (error) {
      setError(error.message || "Failed to fetch courses");
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    modules.forEach((module) => {
      if (module.videoUrl && thumbnailRefs.current[module._id]) {
        const videoElement = thumbnailRefs.current[module._id];
        videoElement.currentTime = 2; // Set to 2 seconds to avoid black frames
        videoElement.addEventListener("loadeddata", () => {
          videoElement.pause();
        });
      }
    });
  }, [modules]);

  const fetchCourseAndModules = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch modules for this course
      const modulesResponse = await axios.get(`${BACKEND_URL}/getModules`, {
        params: { courseId },
      });
      setModules(modulesResponse.data);
    } catch (err) {
      setError(err.message || "Failed to fetch course data");
      console.error("Error fetching course or modules:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewModule = (moduleId) => {
    navigate(`/courses/${courseId}/modules/${moduleId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Loading modules...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400">Error: {error}</p>
          <button
            onClick={fetchCourseAndModules}
            className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!modules || modules.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors w-fit"
          >
            <ArrowLeft size={20} />
            <span>Back to Courses</span>
          </motion.button>

          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">No modules found for this course.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-6">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors w-fit"
            >
              <ArrowLeft size={20} />
              <span>Back to Courses</span>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-gray-800 pb-6"
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {course?.title || "Course Modules"}
              </h1>
              {course?.description && (
                <p className="text-gray-400 mt-2">{course.description}</p>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {modules.map((module, index) => (
              <motion.div
                key={module._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.43, 0.13, 0.23, 0.96],
                }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-300 shadow-lg hover:shadow-cyan-400/20"
              >
                <div className="relative overflow-hidden h-48">
                  {module.videoUrl ? (
                    // Video thumbnail generation (like in CourseModules)
                    <div className="absolute inset-0 bg-gray-900 overflow-hidden">
                      <video
                        ref={(el) => (thumbnailRefs.current[module._id] = el)}
                        src={module.videoUrl}
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                    </div>
                  ) : (
                    // Fallback to static image if no video URL
                    <>
                      <motion.img
                        src={module.thumbnail || "/api/placeholder/400/320"}
                        alt={module.title}
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                    </>
                  )}

                  {module.duration && (
                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-gray-900/80 backdrop-blur-sm rounded-full text-sm font-medium text-cyan-400 border border-gray-700/50">
                      {module.duration}
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="text-xl font-semibold text-gray-100 group-hover:text-cyan-400 transition-colors duration-300"
                  >
                    {module.title}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="text-gray-400 text-sm leading-relaxed"
                  >
                    {module.description}
                  </motion.p>

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                    onClick={() => handleViewModule(module._id)}
                    className="w-full px-6 py-3 mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-cyan-500/25"
                  >
                    View Module
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ModulesPage;
