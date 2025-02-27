import React, { useState } from 'react';
import {
  Trophy,
  BookOpen,
  Award,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  ExternalLink,
  ChevronLeft,
  Send
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { AllUsers } from '../Data/AllUsers';

const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = AllUsers.find(u => u.id === parseInt(userId, 10));
  const [isConnected, setIsConnected] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConnect = () => {
    setIsConnected(!isConnected);
  };

  const handleSendMessage = (message) => {
    console.log('Sending message:', message);
    setIsDialogOpen(false);
  };

  // Custom Dialog Component
  const MessageDialog = ({ isOpen, onClose, onSend }) => {
    const [messageText, setMessageText] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
      onSend(messageText);
      setMessageText('');
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">Send Message</h2>
            <p className="text-gray-400">Send a message to {user.name}</p>
          </div>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message here..."
            className="w-full h-32 p-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 
                     resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 
                       transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!messageText.trim()}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 
                       transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Stats cards data
  const statsCards = [
    {
      icon: <BookOpen className="w-8 h-8 mx-auto mb-3 text-blue-400" />,
      value: user?.modulesCompleted || 0,
      label: "Modules Completed",
      color: "text-blue-400"
    },
    {
      icon: <Trophy className="w-8 h-8 mx-auto mb-3 text-yellow-400" />,
      value: user?.quizzesCompleted || 0,
      label: "Quizzes Completed",
      color: "text-yellow-400"
    },
    {
      icon: <Award className="w-8 h-8 mx-auto mb-3 text-purple-400" />,
      value: user?.badges || 0,
      label: "Badges Earned",
      color: "text-purple-400"
    }
  ];

  // Social links data
  const socialLinks = [
    {
      icon: <Github className="w-6 h-6" />,
      name: "Github",
      url: user?.socialLinks.github,
      color: "text-white"
    },
    {
      icon: <Twitter className="w-6 h-6" />,
      name: "Twitter",
      url: user?.socialLinks.twitter,
      color: "text-blue-400"
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      name: "LinkedIn",
      url: user?.socialLinks.linkedin,
      color: "text-blue-600"
    },
    {
      icon: <Instagram className="w-6 h-6" />,
      name: "Instagram",
      url: user?.socialLinks.instagram,
      color: "text-pink-500"
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-400">User not found</h2>
          <p className="text-gray-500 mt-2">The user you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-3 bg-gray-800 rounded-xl hover:bg-gray-700 
                     transition-colors duration-300 flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-24 left-4 md:left-8 px-4 py-2 bg-gray-800/90 rounded-xl hover:bg-gray-700 
                 transition-colors duration-300 flex items-center gap-2 backdrop-blur-sm z-10"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      {/* Profile Header */}
      <div className="relative">
        {/* Background Pattern */}
        <div className="h-64 w-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Profile Image and Action Buttons */}
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-40 h-40 rounded-2xl object-cover border-4 border-gray-900 
                       shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full 
                         border-4 border-gray-900"></div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleConnect}
              className={`px-6 py-2 rounded-lg transition-colors duration-300 
                       ${isConnected
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              {isConnected ? 'Connected' : 'Connect'}
            </button>

            <button
              onClick={() => setIsDialogOpen(true)}
              className="px-6 py-2 rounded-lg border border-gray-600 text-white 
                       hover:bg-gray-800 transition-colors duration-300"
            >
              Message
            </button>
          </div>
        </div>
      </div>

      {/* Message Dialog */}
      <MessageDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSend={handleSendMessage}
      />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 mt-28">
        {/* User Info */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-3">{user.name}</h1>
          <p className="text-blue-400 text-lg">{user.email}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-800/50 rounded-xl p-6 text-center transform hover:scale-105 
                      transition-all duration-300 hover:bg-gray-800"
            >
              {stat.icon}
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-gray-800/30 rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">About</h2>
              <p className="text-gray-400 leading-relaxed">{user.about}</p>
            </div>

            {/* Blogs Section */}
            <div className="bg-gray-800/30 rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Latest Blogs</h2>
              <div className="space-y-6">
                {user.allBlogs.map((blog, index) => (
                  <div
                    key={index}
                    className="group bg-gray-800/50 rounded-xl overflow-hidden hover:bg-gray-800/80 
                             transition-all duration-300"
                  >
                    {blog.imageUrl && (
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-medium text-white group-hover:text-blue-400 
                                 transition-colors duration-300 mb-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-400 line-clamp-3">{blog.description}</p>
                      <button className="mt-4 text-blue-400 hover:text-blue-300 transition-colors duration-300">
                        Read more →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Skills Section */}
            <div className="bg-gray-800/30 rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20
                           hover:bg-blue-500/20 transition-colors duration-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gray-800/30 rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Connect</h2>
              <div className="space-y-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 
                             transition-colors duration-300 text-gray-400 hover:text-white w-full group"
                  >
                    <span className={social.color}>{social.icon}</span>
                    <span>{social.name}</span>
                    <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default UserProfilePage;