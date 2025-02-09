    import React, { useState, useEffect } from "react";
    import { useParams } from "react-router-dom";
    import axios from "axios";
    import { motion } from "framer-motion";
    import { ArrowLeft } from "lucide-react";
    import { useNavigate } from "react-router-dom";

    const ModulesPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Demo modules for testing
    const demoModules = [
        {
        _id: "module-1",
        title: "Getting Started with Development",
        description:
            "Learn the basic concepts and set up your development environment. We will cover essential tools and best practices to start your journey.",
        thumbnail: "/api/placeholder/400/320",
        duration: "2 hours",
        },
        {
        _id: "module-2",
        title: "Understanding Core Concepts",
        description:
            "Deep dive into fundamental concepts. Master the building blocks that will form the foundation of your learning journey.",
        thumbnail: "/api/placeholder/400/320",
        duration: "3 hours",
        },
    ];

    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);

    const fetchCourseDetails = async () => {
        try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${BACKEND_URL}/allCourse`, {
            params: { courseId },
        });
        setCourse(response.data);
        } catch (err) {
        setError(err.message || "Failed to fetch course details");
        console.error("Error fetching course:", err);
        } finally {
        setLoading(false);
        }
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

    return (
        <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto p-6 space-y-8">

                <button
                onClick={fetchCourseDetails}
                className="ml-4 text-sm underline hover:text-red-400"
                >
                Try again
                </button>

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
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {demoModules.map((module, index) => (
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
                    <div className="relative overflow-hidden">
                    <motion.img
                        src={module.thumbnail}
                        alt={module.title}
                        className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-gray-900/80 backdrop-blur-sm rounded-full text-sm font-medium text-cyan-400 border border-gray-700/50">
                        {module.duration}
                    </div>
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
                        className="w-full px-6 py-3 mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-cyan-500/25"
                    >
                        Start Module
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
