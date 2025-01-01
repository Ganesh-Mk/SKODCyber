import { useState, useRef } from 'react';
import { Book, ChevronRight, PlayCircle, Award, ArrowRight, Menu, Volume2, Maximize2, X } from 'lucide-react';
import { modules } from '../Data/Learndata';
import QuizModal from '../Components/QuizModal';

const LearningPage = () => {
  const [activeModule, setActiveModule] = useState(1);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const contentRef = useRef(null);
  const videoRef = useRef(null);

  const handleNextModule = () => {
    setActiveModule(prev => Math.min(prev + 1, modules.length));
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setSidebarOpen(false);
    setIsPlaying(false);
  };

  const handlePrevModule = () => {
    setActiveModule(prev => Math.max(prev - 1, 1));
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setSidebarOpen(false);
    setIsPlaying(false);
  };

  const getYouTubeEmbedUrl = (url) => {
    try {
      const urlObj = new URL(url);
      let videoId;
  
      if (urlObj.hostname === 'youtu.be') {
        videoId = urlObj.pathname.substring(1);
      } else {
        const searchParams = new URLSearchParams(urlObj.search);
        videoId = searchParams.get('v');
      }
  
      return videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1` : '';
    } catch {
      return '';
    }
  };
  

  const VideoPlayer = ({ videoUrl }) => {
    if (!isPlaying) {
      return (
        <div 
          className="bg-gray-800 rounded-xl aspect-video mb-6 md:mb-8 flex items-center justify-center cursor-pointer group relative"
          onClick={() => setIsPlaying(true)}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <PlayCircle className="h-12 w-12 md:h-16 md:w-16 text-white opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Volume2 className="h-5 w-5 text-white opacity-60" />
            <Maximize2 className="h-5 w-5 text-white opacity-60" />
          </div>
          <div className="absolute bottom-4 left-4">
            <h3 className="text-white text-sm md:text-base font-medium">
              {modules[activeModule - 1].title}
            </h3>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-xl overflow-hidden aspect-video mb-6 md:mb-8 relative group">
        <iframe
          ref={videoRef}
          className="w-full h-full"
          src={getYouTubeEmbedUrl(videoUrl)}
          title="Video Player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <button 
          onClick={() => setIsPlaying(false)}
          className="absolute top-4 right-4 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4 text-white" />
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 pt-16">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2">
          <Menu className="h-6 w-6" />
        </button>
        <h2 className="text-lg font-semibold">Chapter {activeModule}</h2>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-0 z-30 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 w-72 md:w-56 overflow-y-auto
      `}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Learning Concepts</h2>
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-1">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => {
                  setActiveModule(module.id);
                  setSidebarOpen(false);
                  setIsPlaying(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 
                  ${activeModule === module.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <div className="flex items-center">
                  <Book className="h-4 w-4 mr-2" />
                  <span>Chapter {module.id}</span>
                  {activeModule === module.id && <ChevronRight className="h-4 w-4 ml-auto" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto py-4 md:py-8">
          {/* Module Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {modules[activeModule - 1].title}
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              {modules[activeModule - 1].description}
            </p>
          </div>

          {/* Video Section */}
          <VideoPlayer videoUrl={modules[activeModule - 1].videoUrl} />

          {/* Content Sections */}
          <div className="prose max-w-none mb-6 md:mb-8">
            {Object.entries(modules[activeModule - 1].mainContent).map(([key, section]) => (
              <div key={key} className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">
                  {section.title}
                </h2>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Key Points */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-8 mb-6 md:mb-8">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Key Learning Points</h3>
            <ul className="space-y-3">
              {modules[activeModule - 1].keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-indigo-500 mr-3 mt-0.5" />
                  <span className="text-gray-600 text-base md:text-lg">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Resources */}
          <div className="bg-indigo-50 rounded-lg p-4 md:p-8 mb-6 md:mb-8">
            <h3 className="text-lg md:text-xl font-semibold text-indigo-900 mb-4">
              Additional Resources
            </h3>
            <div className="space-y-3">
              {modules[activeModule - 1].additionalResources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.link}
                  className="flex items-center text-indigo-600 hover:text-indigo-700 text-base md:text-lg"
                >
                  <Book className="h-5 w-5 mr-3" />
                  {resource.title} ({resource.type})
                </a>
              ))}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-6 md:pt-8 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button 
                onClick={() => setIsQuizOpen(true)} 
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors duration-200"
              >
                <Award className="h-5 w-5 mr-2" />
                Take Quiz
              </button>
              <button
                onClick={handlePrevModule}
                disabled={activeModule === 1}
                className={`w-full sm:w-auto flex items-center justify-center px-6 py-3 rounded-lg transition-colors duration-200
                  ${activeModule === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Previous
              </button>
            </div>
            <button
              onClick={handleNextModule}
              disabled={activeModule === modules.length}
              className={`w-full sm:w-auto flex items-center justify-center px-8 py-3 rounded-lg transition-colors duration-200
                ${activeModule === modules.length
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white`}
            >
              Next Module
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </div>

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        quiz={modules[activeModule - 1].quiz}
        moduleId={activeModule}
      />
    </div>
  );
};

export default LearningPage;