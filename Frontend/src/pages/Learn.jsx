import React, { useState, useEffect } from "react";
import { ArrowLeft, Book, ChevronRight, Award } from "lucide-react";
import { modules } from "../Data/Learndata";

const LearningPage = () => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [completedModules, setCompletedModules] = useState([]);
  const [badges, setBadges] = useState(0);
  const [totalQuizAttempts, setTotalQuizAttempts] = useState(0);

  useEffect(() => {
    // Load all stored data on component mount
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
    setQuizAnswers({});
    setShowResults(false);
  };

  const handleAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }));
  };

  const calculateScore = (quiz) => {
    let correct = 0;
    Object.entries(quizAnswers).forEach(([questionIndex, answer]) => {
      if (answer === quiz[questionIndex].answer) correct++;
    });
    return (correct / quiz.length) * 100;
  };

  const updateProgress = (score, moduleId) => {
    // Increment quiz attempts counter regardless of score
    const newQuizAttempts = totalQuizAttempts + 1;
    setTotalQuizAttempts(newQuizAttempts);
    localStorage.setItem('quizAttempts', newQuizAttempts.toString());

    // Add module to completed list if not already included
    if (!completedModules.includes(moduleId)) {
      const updatedModules = [...completedModules, moduleId];
      setCompletedModules(updatedModules);
      localStorage.setItem('completedModules', JSON.stringify(updatedModules));
    }

    // Award badge only if score is 100%
    if (score === 100) {
      const newBadgeCount = badges + 1;
      setBadges(newBadgeCount);
      localStorage.setItem('badges', newBadgeCount.toString());
    }
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
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
        <div className="fixed top-[5rem] left-4 z-50">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 group bg-white px-2 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5  transform group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 md:p-8 lg:p-10">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
                {module.title}
              </h1>
              <p className="text-gray-600 mb-6 sm:mb-8">{module.description}</p>

              <div className="aspect-[5/2.5] mb-6 sm:mb-8 md:mb-10 rounded-xl overflow-hidden bg-gray-900">
                <iframe
                  className="w-full h-full"
                  src={getYouTubeEmbedUrl(module.videoUrl)}
                  title="Video Player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="prose max-w-none space-y-6 sm:space-y-8 md:space-y-10">
                {Object.entries(module.mainContent).map(([key, section]) => (
                  <div key={key}>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4">
                      {section.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 md:p-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
                Key Learning Points
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                {module.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-indigo-500 mr-3 sm:mr-4 mt-0.5" />
                    <span className="text-gray-600 text-sm sm:text-base">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-indigo-50 rounded-xl p-4 sm:p-6 md:p-8 shadow-md hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg sm:text-xl font-semibold text-indigo-900 mb-4 sm:mb-6">
                Additional Resources
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {module.additionalResources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-indigo-600 hover:text-indigo-700 text-sm sm:text-base"
                  >
                    <Book className="h-5 w-5 mr-3 sm:mr-4" />
                    {resource.title} ({resource.type})
                  </a>
                ))}
              </div>
            </div>

            {!isQuizOpen ? (
              <button
                onClick={() => setIsQuizOpen(true)}
                className="w-full py-4 sm:py-6 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
              >
                <Award className="h-5 w-5 mr-2 sm:mr-3" />
                Take Module Quiz
              </button>
            ) : (
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 md:p-8">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Module Quiz</h3>
                {module.quiz.map((question, qIndex) => (
                  <div key={qIndex} className="mb-4 sm:mb-6">
                    <p className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                      {question.question}
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <button
                          key={oIndex}
                          onClick={() => handleAnswer(qIndex, oIndex)}
                          className={`w-full text-left p-3 rounded-lg border text-sm sm:text-base ${
                            quizAnswers[qIndex] === oIndex
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-200 hover:bg-gray-50"
                          } shadow-sm hover:shadow-md transition-shadow duration-300`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {!showResults ? (
                  <button
                    onClick={() => {
                      const score = calculateScore(module.quiz);
                      setShowResults(true);
                      updateProgress(score, module.id);
                    }}
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold mb-2">
                      Your Score: {calculateScore(module.quiz)}%
                    </p>
                    {calculateScore(module.quiz) === 100 && (
                      <p className="text-green-600 mb-4">
                        Congratulations! You've earned a badge!
                      </p>
                    )}
                    <button
                      onClick={() => {
                        setQuizAnswers({});
                        setShowResults(false);
                      }}
                      className="text-indigo-600 hover:text-indigo-700 text-sm sm:text-base"
                    >
                      Retake Quiz
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 md:p-12 lg:p-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Learning Modules</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Completed: {completedModules.length}/{modules.length} Modules
            </span>
            <div className="flex items-center space-x-1">
              <Award className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-gray-600">{badges}</span>
            </div>
            <span className="text-sm text-gray-600">
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
              <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden h-full flex flex-col relative">
                {completedModules.includes(module.id) && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full">
                    <Award className="h-4 w-4" />
                  </div>
                )}
                <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 relative w-full">
                  <img
                    src={`/public/Images/module${module.id}.avif`}
                    alt={`Banner for ${module.title}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-indigo-600 transition-colors">
                    Chapter {module.id}: {module.title}
                  </h3>
                  <p className="text-gray-600 text-sm flex-1 line-clamp-3">
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