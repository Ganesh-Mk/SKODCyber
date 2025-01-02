import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section with Dark Cybersecurity Theme */}
      <section className="relative min-h-screen flex items-center px-4 sm:px-6">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b')] 
      bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/95 to-blue-900/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        </div>

        <div className="relative container mx-auto py-16 sm:py-32">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="lg:w-1/2 text-white">
              <div className="inline-block px-4 py-2 bg-blue-500/10 rounded-full mb-6">
                <span className="text-blue-400 font-medium">Welcome to SKOD</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Master
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  {" "}Cybersecurity{" "}
                </span>
                Through Practice
              </h1>
              <p className="text-lg sm:text-xl mb-8 text-gray-300 leading-relaxed">
                Join over 100,000 security professionals and enthusiasts in our immersive learning platform.
                Master real-world hacking techniques, defensive strategies, and security best practices.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4">
                <button onClick={() => navigate('/learn')} className="w-full sm:w-auto group relative px-8 py-4 bg-gradient-to-r from-blue-600 
            to-cyan-600 rounded-lg font-semibold overflow-hidden">
                  <span className="relative z-10 text-white">Start Your Journey</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-700 translate-y-full 
              group-hover:translate-y-0 transition-transform duration-300" />
                </button>
                <button onClick={() => navigate('/learn')} className="w-full sm:w-auto px-8 py-4 border border-white/20 hover:bg-white/10 
            text-white rounded-lg font-semibold transition-colors duration-300">
                  View Learning Paths
                </button>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="w-full aspect-square relative">
                <img
                  src="https://cdni.iconscout.com/illustration/premium/thumb/cyber-security-developer-illustration-download-in-svg-png-gif-file-formats--development-developing-cloud-data-dev-working-on-pack-crime-illustrations-5175408.png"
                  alt="Cybersecurity Shield"
                  className="absolute inset-0 w-full h-full object-contain opacity-35 filter blur-sm"
                />
                <img
                  src="https://cdni.iconscout.com/illustration/premium/thumb/cyber-security-developer-illustration-download-in-svg-png-gif-file-formats--development-developing-cloud-data-dev-working-on-pack-crime-illustrations-5175408.png"
                  alt="Cybersecurity Shield"
                  className="absolute inset-0 w-full h-full object-contain animate-float"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-800/50 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "100K+", label: "Active Students" },
              { number: "500+", label: "Learning Modules" },
              { number: "50+", label: "Practice Labs" },
              { number: "95%", label: "Success Rate" }
            ].map((stat, index) => (
              <div key={index}
                className="text-center p-6 bg-gray-700/30 backdrop-blur-sm rounded-xl transform 
                hover:scale-105 transition-all duration-300 border border-gray-700/50">
                <div className="text-4xl font-bold text-blue-400 mb-2">{stat.number}</div>
                <div className="text-white">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-900/50 relative">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            World-Class Learning Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Virtual Hacking Labs",
                description: "Practice in isolated environments with real-world scenarios and vulnerabilities",
                image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
              },
              {
                title: "Expert-Led Courses",
                description: "Learn from industry professionals with years of practical experience",
                image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb"
              },
              {
                title: "Career Pathways",
                description: "Structured learning paths from Security Analyst to Penetration Tester",
                image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
              }
            ].map((feature, index) => (
              <div key={index}
                className="group relative overflow-hidden rounded-xl bg-gray-800 border border-gray-700/50">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform 
                    duration-500"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-white">Latest in Cybersecurity</h2>
            <button onClick={() => navigate("/news")} className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
              View All News →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Critical Zero-Day in Popular Framework",
                date: "2 hours ago",
                category: "Security Alert",
                image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f"
              },
              {
                title: "Advanced Red Team Tactics Course Launch",
                date: "1 day ago",
                category: "New Course",
                image: "https://images.unsplash.com/photo-1526374870839-e155464bb9b2"
              },
              {
                title: "Cybersecurity Market Trends 2025",
                date: "2 days ago",
                category: "Industry News",
                image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
              }
            ].map((news, index) => (
              <div key={index}
                className="group bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800 
                hover:border-blue-500/30 transition-colors duration-300">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform 
                    duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="text-sm text-blue-400 mb-2">{news.category}</div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 
                    transition-colors duration-300">
                    {news.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{news.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Redesigned CTA Section */}
      <section className="py-32 bg-gradient-to-b from-gray-900 via-blue-900/20 to-gray-900">
        <div className="container mx-auto px-6">
          <div className="relative bg-gray-800/50 rounded-2xl p-12 border border-gray-700/50 
            backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="lg:w-2/3">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Ready to Start Your Journey in Cybersecurity?
                </h2>
                <p className="text-xl text-gray-300">
                  Join the next generation of cybersecurity professionals. Get hands-on experience
                  with real-world scenarios and expert guidance.
                </p>
              </div>
              <div className="lg:w-1/3 flex justify-center">
                <button onClick={() => navigate('/learn')} className="group relative px-8 py-4 bg-white rounded-lg font-semibold text-lg 
                  overflow-hidden">
                  <span className="relative z-10 text-gray-900 group-hover:text-white transition-colors 
                    duration-300">
                    Start Learning Now
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 translate-y-full 
                    group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animations */}
      <style jsx>{`
      @keyframes float {
    0% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-20px) scale(1.05); }
    100% { transform: translateY(0px) scale(1); }
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
      `}</style>
    </div>
  );
};

export default Home;