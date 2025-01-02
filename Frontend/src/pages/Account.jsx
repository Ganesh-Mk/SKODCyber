import React, { useState, useEffect } from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, ResponsiveContainer } from 'recharts';
import { Camera, Github, Instagram, Linkedin, Twitter, Edit2, Award, BookOpen, CheckSquare, X } from 'lucide-react';

const Account = () => {
  const [userData, setUserData] = useState(() => {
    return JSON.parse(localStorage.getItem('userData')) || {
      name: 'Alex Thompson',
      email: 'alex.thompson@example.com',
      about: 'Passionate cybersecurity enthusiast with a focus on network security and penetration testing. Always eager to learn and share knowledge with the community.',
      image: "https://cdn-icons-png.flaticon.com/512/10398/10398223.png",
      social: {
        twitter: 'alexthompson',
        instagram: 'alex.security',
        linkedin: 'alexthompson-cyber',
        github: 'alexthompson-sec'
      }
    };
  });
  const [completedModules, setcompletedModules] = useState({})
  const [badges, setbadges] = useState("0")
  const [quizzes, setquizzes] = useState("0")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ ...userData });
  const [imagePreview, setImagePreview] = useState(null);
  const [isAddCertModalOpen, setIsAddCertModalOpen] = useState(false);
  const [certifications, setCertifications] = useState([
    { 
      name: 'CompTIA Security+',
      date: 'May 2024',
      status: 'active',
      score: '95%'
    },
    {
      name: 'Certified Ethical Hacker (CEH)',
      date: 'March 2024',
      status: 'active',
      score: '92%'
    },
    {
      name: 'CISSP',
      date: 'January 2024',
      status: 'active',
      score: '89%'
    }
  ]);

  const [newCertification, setNewCertification] = useState({
    name: '',
    date: '',
    status: 'active',
    score: ''
  });

  // Sample data for charts
  const quizScores = [
    { name: 'Network Security', score: 92 },
    { name: 'Web Security', score: 88 },
    { name: 'Cryptography', score: 95 },
    { name: 'Malware Analysis', score: 85 },
    { name: 'Incident Response', score: 90 }
  ];

  const progressData = [
    { month: 'Jan', modules: 4 },
    { month: 'Feb', modules: 7 },
    { month: 'Mar', modules: 12 },
    { month: 'Apr', modules: 15 },
    { month: 'May', modules: 18 }
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, image: reader.result });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const storedCompletedModules = localStorage.getItem('completedModules')
    setcompletedModules(JSON.parse(storedCompletedModules))
    setbadges(localStorage.getItem('badges'))
    setquizzes(localStorage.getItem('quizAttempts'))
  },[])

  const saveChanges = () => {
    setUserData(editForm);
    localStorage.setItem('userData', JSON.stringify(editForm));
    setIsEditModalOpen(false);
  };

  const handleAddCertification = () => {
    if (newCertification.name && newCertification.date && newCertification.score) {
      setCertifications([...certifications, { ...newCertification }]);
      setNewCertification({
        name: '',
        date: '',
        status: 'active',
        score: ''
      });
      setIsAddCertModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={userData.image || '/api/placeholder/128/128'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800">{userData.name}</h1>
              <p className="text-gray-600 mt-2">{userData.email}</p>
              <p className="text-gray-700 mt-4 max-w-2xl">{userData.about}</p>
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors duration-300"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Modules Completed</h3>
                <p className="text-3xl font-bold text-blue-600">{completedModules.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckSquare className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Quizzes Given</h3>
                <p className="text-3xl font-bold text-green-600">{quizzes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Bages</h3>
                <p className="text-3xl font-bold text-purple-600">{badges}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Quiz Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quizScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Learning Progress</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="modules" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Certifications and Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Professional Certifications</h3>
            <div className="space-y-4">
              {certifications.map((cert) => (
                <div key={cert.name} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-all duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{cert.name}</h4>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {cert.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Achieved: {cert.date}</span>
                    <span>Score: {cert.score}</span>
                  </div>
                </div>
              ))}
              <div className="mt-6">
                <button 
                  onClick={() => setIsAddCertModalOpen(true)}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-500 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Award className="w-5 h-5" />
                  Add New Certification
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Social Links</h3>
            <div className="space-y-4">
              <a href={`https://twitter.com/${userData.social.twitter}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                <Twitter className="w-5 h-5 text-blue-400" />
                <span className="text-gray-700">@{userData.social.twitter}</span>
              </a>
              <a href={`https://instagram.com/${userData.social.instagram}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                <Instagram className="w-5 h-5 text-pink-500" />
                <span className="text-gray-700">@{userData.social.instagram}</span>
              </a>
              <a href={`https://linkedin.com/in/${userData.social.linkedin}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                <Linkedin className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">{userData.social.linkedin}</span>
              </a>
              <a href={`https://github.com/${userData.social.github}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                <Github className="w-5 h-5 text-gray-800" />
                <span className="text-gray-700">{userData.social.github}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="font-medium">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                      <img
                        src={imagePreview || editForm.image || '/api/placeholder/96/96'}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-300">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <Camera className="w-5 h-5 inline-block mr-2" />
                      Upload Photo
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-medium">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-medium">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-medium">About</label>
                  <textarea
                    value={editForm.about}
                    onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                    rows={4}
                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <label className="font-medium">Social Links</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                      <Twitter className="w-5 h-5 text-blue-400" />
                      <input
                        type="text"
                        value={editForm.social.twitter}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          social: { ...editForm.social, twitter: e.target.value }
                        })}
                        className="flex-1 focus:outline-none"
                        placeholder="Twitter username"
                      />
                    </div>
                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                      <Instagram className="w-5 h-5 text-pink-500" />
                      <input
                        type="text"
                        value={editForm.social.instagram}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          social: { ...editForm.social, instagram: e.target.value }
                        })}
                        className="flex-1 focus:outline-none"
                        placeholder="Instagram username"
                      />
                    </div>
                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                      <Linkedin className="w-5 h-5 text-blue-600" />
                      <input
                        type="text"
                        value={editForm.social.linkedin}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          social: { ...editForm.social, linkedin: e.target.value }
                        })}
                        className="flex-1 focus:outline-none"
                        placeholder="LinkedIn username"
                      />
                    </div>
                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                      <Github className="w-5 h-5 text-gray-800" />
                      <input
                        type="text"
                        value={editForm.social.github}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          social: { ...editForm.social, github: e.target.value }
                        })}
                        className="flex-1 focus:outline-none"
                        placeholder="GitHub username"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveChanges}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Certification Modal */}
        {isAddCertModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add New Certification</h2>
                <button 
                  onClick={() => setIsAddCertModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certification Name
                  </label>
                  <input
                    type="text"
                    value={newCertification.name}
                    onChange={(e) => setNewCertification({
                      ...newCertification,
                      name: e.target.value
                    })}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., CompTIA Security+"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Achieved
                  </label>
                  <input
                    type="month"
                    value={newCertification.date}
                    onChange={(e) => setNewCertification({
                      ...newCertification,
                      date: e.target.value
                    })}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Score
                  </label>
                  <input
                    type="text"
                    value={newCertification.score}
                    onChange={(e) => setNewCertification({
                      ...newCertification,
                      score: e.target.value
                    })}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 95%"
                  />
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() => setIsAddCertModalOpen(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCertification}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                    disabled={!newCertification.name || !newCertification.date || !newCertification.score}
                  >
                    Add Certification
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;