import { useState, useRef } from 'react';
import { Book, ChevronRight, PlayCircle, Award, ArrowRight } from 'lucide-react';
import {modules} from '../Data/Learndata'


const LearningPage = () => {
  const [activeModule, setActiveModule] = useState(1);
  const contentRef = useRef(null);

  const handleNextModule = () => {
    setActiveModule(prev => Math.min(prev + 1, modules.length));
    // Scroll to top of content container
    contentRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 pt-16">
      {/* Sidebar - Made narrower */}
      <div className="w-56 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Learning Modules</h2>
          <div className="space-y-1">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                  activeModule === module.id
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <Book className="h-4 w-4 mr-2" />
                  <span>Module {module.id}</span>
                  {activeModule === module.id && (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Made wider */}
      <div ref={contentRef} className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-8 px-8">
          {/* Module Header and Introduction */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {modules[activeModule - 1].title}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {modules[activeModule - 1].description}
            </p>
          </div>

          {/* Video Section - Made wider */}
          <div className="bg-gray-800 rounded-xl aspect-video mb-8 flex items-center justify-center">
            <PlayCircle className="h-16 w-16 text-white opacity-60" />
          </div>

          {/* Main Content Sections */}
          <div className="prose max-w-none mb-8">
            {Object.entries(modules[activeModule - 1].mainContent).map(([key, section]) => (
              <div key={key} className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{section.title}</h2>
                <p className="text-gray-600 leading-relaxed text-lg">{section.content}</p>
              </div>
            ))}
          </div>

          {/* Key Points - Improved spacing */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h3 className="text-xl font-semibold mb-4">Key Learning Points</h3>
            <ul className="space-y-3">
              {modules[activeModule - 1].keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-indigo-500 mr-3 mt-0.5" />
                  <span className="text-gray-600 text-lg">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Resources */}
          <div className="bg-indigo-50 rounded-lg p-8 mb-8">
            <h3 className="text-xl font-semibold text-indigo-900 mb-4">Additional Resources</h3>
            <div className="space-y-3">
              {modules[activeModule - 1].additionalResources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.link}
                  className="flex items-center text-indigo-600 hover:text-indigo-700 text-lg"
                >
                  <Book className="h-5 w-5 mr-3" />
                  {resource.title} ({resource.type})
                </a>
              ))}
            </div>
          </div>

          {/* Bottom Navigation - Improved spacing */}
          <div className="flex justify-between items-center border-t pt-8">
            <button className="flex items-center px-6 py-3 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors duration-200">
              <Award className="h-5 w-5 mr-2" />
              Take Quiz
            </button>
            
            <button 
              onClick={handleNextModule}
              className="flex items-center px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Next Module
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;