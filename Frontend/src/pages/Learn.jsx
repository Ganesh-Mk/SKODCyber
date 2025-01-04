import React, { useState, useEffect } from "react";
import { ArrowLeft, Book, ChevronRight, Award } from "lucide-react";
import { modules } from "../Data/Learndata";
import { useNavigate } from "react-router-dom";
import QuizModal from "../Components/QuizModal";

const LearningPage = () => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [completedModules, setCompletedModules] = useState([]);
  const [badges, setBadges] = useState(0);
  const [totalQuizAttempts, setTotalQuizAttempts] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('userData')) === null) {
      navigate('/login');
    }
  })

  useEffect(() => {
    const storedModules = JSON.parse(localStorage.getItem('completedModules')) || [];
    const storedBadges = parseInt(localStorage.getItem('badges')) || 0;
    const storedQuizAttempts = parseInt(localStorage.getItem('quizAttempts')) || 0;

    setCompletedModules(storedModules);
    setBadges(storedBadges);
    setTotalQuizAttempts(storedQuizAttempts);
  }, []);

  const handleBack = () => {
    setSelectedModule(null);
    setIsQuizOpen(false);
  };

  const getYouTubeEmbedUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const videoId =
        urlObj.hostname === "youtu.be"
          ? urlObj.pathname.substring(1)
          : new URLSearchParams(urlObj.search).get("v");
      return videoId
        ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1`
        : "";
    } catch {
      return "";
    }
  };

  if (selectedModule) {
    const module = modules[selectedModule - 1];

    return (
      <div className="min-h-screen bg-gray-900 p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="fixed top-[5rem] left-4 z-50">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 group bg-gray-800 px-2 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <div className="bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 md:p-8 lg:p-10">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-white">
                {module.title}
              </h1>
              <p className="text-gray-300 mb-6 sm:mb-8">{module.description}</p>

              <div className="aspect-[5/2.5] mb-6 sm:mb-8 md:mb-10 rounded-xl overflow-hidden bg-black">
                <iframe
                  className="w-full h-full"
                  src={getYouTubeEmbedUrl(module.videoUrl)}
                  title="Video Player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="prose prose-invert max-w-none space-y-6 sm:space-y-8 md:space-y-10">
                {Object.entries(module.mainContent).map(([key, section]) => (
                  <div key={key}>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 text-white">
                      {section.title}
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 md:p-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-white">
                Key Learning Points
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                {module.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-purple-400 mr-3 sm:mr-4 mt-0.5" />
                    <span className="text-gray-300 text-sm sm:text-base">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 md:p-8 shadow-md hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg sm:text-xl font-semibold text-purple-300 mb-4 sm:mb-6">
                Additional Resources
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {module.additionalResources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-purple-400 hover:text-purple-300 text-sm sm:text-base"
                  >
                    <Book className="h-5 w-5 mr-3 sm:mr-4" />
                    {resource.title} ({resource.type})
                  </a>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsQuizOpen(true)}
              className="w-full py-4 sm:py-6 bg-purple-900/50 text-purple-300 rounded-xl hover:bg-purple-800/50 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
            >
              <Award className="h-5 w-5 mr-2 sm:mr-3" />
              Take Module Quiz
            </button>

            <QuizModal
              isOpen={isQuizOpen}
              onClose={() => setIsQuizOpen(false)}
              quiz={module.quiz}
              moduleId={module.id}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 md:p-12 lg:p-16">
      <div className="max-w-7xl mx-auto mt-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold text-white">Learning Modules</h1>
          <div className="flex flex-wrap items-center gap-4 md:gap-0 md:space-x-10">
            <span className="text-1xl text-gray-300">
              Completed: {completedModules.length}/{modules.length} Modules
            </span>
            <div className="flex items-center space-x-1">
              <Award className="h-6 w-6 text-yellow-500" />
              <span className="text-1xl text-gray-300">{badges}</span>
            </div>
            <span className="text-1xl text-gray-300">
              Quiz Attempts: {totalQuizAttempts}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={() => setSelectedModule(module.id)}
              className="group cursor-pointer h-[320px]"
            >
              <div className="bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden h-full flex flex-col relative">
                {completedModules.includes(module.id) && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full">
                    <Award className="h-4 w-4" />
                  </div>
                )}
                <div className="aspect-video bg-gradient-to-br from-purple-600 to-indigo-800 relative w-full">
                  <img
                    src={`/Images/module${module.id}.avif`}
                    alt={`Banner for ${module.title}`}
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-semibold text-lg mb-2 text-white group-hover:text-purple-400 transition-colors">
                    Chapter {module.id}: {module.title}
                  </h3>
                  <p className="text-gray-300 text-sm flex-1 line-clamp-3">
                    {module.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningPage;