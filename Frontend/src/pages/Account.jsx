import React, { useState, useEffect } from "react";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  Camera,
  Github,
  Instagram,
  Linkedin,
  Twitter,
  Edit2,
  Award,
  BookOpen,
  CheckSquare,
  X,
} from "lucide-react";

const Account = () => {
  const [userData, setUserData] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("userData")) || {
        name: "Alex Thompson",
        email: "alex.thompson@example.com",
        about:
          "Passionate cybersecurity enthusiast with a focus on network security and penetration testing. Always eager to learn and share knowledge with the community.",
        image: "https://cdn-icons-png.flaticon.com/512/10398/10398223.png",
        social: {
          twitter: "alexthompson",
          instagram: "alex.security",
          linkedin: "alexthompson-cyber",
          github: "alexthompson-sec",
        },
      }
    );
  });

  const [completedModules, setcompletedModules] = useState([]);
  const [badges, setbadges] = useState("0");
  const [quizzes, setquizzes] = useState("0");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ ...userData });
  const [imagePreview, setImagePreview] = useState(null);
  const [isAddCertModalOpen, setIsAddCertModalOpen] = useState(false);
  const [progressData, setProgressData] = useState([]);
  const [quizData, setQuizData] = useState([]);

  const generateProgressData = (modules) => {
    if (!modules || modules.length === 0) return [];

    const currentDate = new Date();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return modules.map((moduleId, index) => ({
      month: monthNames[currentDate.getMonth() - (modules.length - 1) + index],
      modules: moduleId,
    }));
  };

  const processQuizData = () => {
    const storedQuizScores = localStorage.getItem("quizScores");
    if (!storedQuizScores) return [];

    const scores = JSON.parse(storedQuizScores);
    return scores.map((quiz) => ({
      name: quiz.name,
      score: quiz.score,
      date: new Date(quiz.date).toLocaleDateString(),
    }));
  };

  const [certifications, setCertifications] = useState([
    {
      name: "CompTIA Security+",
      date: "May 2024",
      status: "active",
      score: "95%",
    },
    {
      name: "Certified Ethical Hacker (CEH)",
      date: "March 2024",
      status: "active",
      score: "92%",
    },
    {
      name: "CISSP",
      date: "January 2024",
      status: "active",
      score: "89%",
    },
  ]);

  const [newCertification, setNewCertification] = useState({
    name: "",
    date: "",
    status: "active",
    score: "",
  });

  useEffect(() => {
    const storedCompletedModules = localStorage.getItem("completedModules");
    const storedQuizScores = localStorage.getItem("quizScores");
    const modules = JSON.parse(storedCompletedModules) || [];
    const quizScores = JSON.parse(storedQuizScores) || [];

    setProgressData(generateProgressData(modules));
    setQuizData(processQuizData());
    setcompletedModules(modules);
    setbadges(localStorage.getItem("badges") || "0");
    setquizzes(quizScores.length.toString() || "0");
  }, []);

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

  const saveChanges = () => {
    setUserData(editForm);
    localStorage.setItem("userData", JSON.stringify(editForm));
    setIsEditModalOpen(false);
  };

  const handleAddCertification = () => {
    if (
      newCertification.name &&
      newCertification.date &&
      newCertification.score
    ) {
      setCertifications([...certifications, { ...newCertification }]);
      setNewCertification({
        name: "",
        date: "",
        status: "active",
        score: "",
      });
      setIsAddCertModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700">
                <img
                  src={userData.image || "/api/placeholder/128/128"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white">{userData.name}</h1>
              <p className="text-gray-400 mt-2">{userData.email}</p>
              <p className="text-gray-300 mt-4 max-w-2xl">{userData.about}</p>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-900 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Modules Completed
                </h3>
                <p className="text-3xl font-bold text-blue-400">
                  {completedModules.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-900 rounded-lg">
                <CheckSquare className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Quizzes Given
                </h3>
                <p className="text-3xl font-bold text-green-400">{quizzes}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-900 rounded-lg">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Badges</h3>
                <p className="text-3xl font-bold text-purple-400">{badges}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Quiz Performance
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quizData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="name"
                    stroke="#9CA3AF"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    domain={[0, 100]}
                    label={{
                      value: "Score (%)",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#9CA3AF" },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                    }}
                    formatter={(value, name) => [`${value}%`, "Score"]}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    dot={{ fill: "#4F46E5", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Learning Progress
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis
                    stroke="#9CA3AF"
                    domain={[
                      0,
                      Math.max(
                        ...(completedModules.length ? completedModules : [1])
                      ) + 1,
                    ]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="modules"
                    stroke="#10B981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Professional Certifications
            </h3>
            <div className="space-y-4">
              {certifications.map((cert) => (
                <div
                  key={cert.name}
                  className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">{cert.name}</h4>
                    <span className="px-3 py-1 bg-green-900 text-green-200 text-sm rounded-full">
                      {cert.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Achieved: {cert.date}</span>
                    <span>Score: {cert.score}</span>
                  </div>
                </div>
              ))}
              <div className="mt-6">
                <button
                  onClick={() => setIsAddCertModalOpen(true)}
                  className="w-full py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-indigo-500 hover:text-indigo-400 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Award className="w-5 h-5" />
                  Add New Certification
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Social Links
            </h3>
            <div className="space-y-4">
              <a
                href={`https://twitter.com/${userData.social.twitter}`}
                className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-300"
              >
                <Twitter className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">
                  @{userData.social.twitter}
                </span>
              </a>
              <a
                href={`https://instagram.com/${userData.social.instagram}`}
                className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-300"
              >
                <Instagram className="w-5 h-5 text-pink-400" />
                <span className="text-gray-300">
                  @{userData.social.instagram}
                </span>
              </a>
              <a
                href={`https://linkedin.com/in/${userData.social.linkedin}`}
                className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-300"
              >
                <Linkedin className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">
                  {userData.social.linkedin}
                </span>
              </a>
              <a
                href={`https://github.com/${userData.social.github}`}
                className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-300"
              >
                <Github className="w-5 h-5 text-white" />
                <span className="text-gray-300">{userData.social.github}</span>
              </a>
            </div>
          </div>
        </div>

        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 text-white">
                Edit Profile
              </h2>
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-300">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700">
                      <img
                        src={
                          imagePreview ||
                          editForm.image ||
                          "/api/placeholder/96/96"
                        }
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="px-4 py-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors duration-300 text-gray-300">
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
                  <label className="font-medium text-gray-300">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-300">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-300">About</label>
                  <textarea
                    value={editForm.about}
                    onChange={(e) =>
                      setEditForm({ ...editForm, about: e.target.value })
                    }
                    rows={4}
                    className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <label className="font-medium text-gray-300">
                    Social Links
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-gray-700 border border-gray-600 rounded-lg">
                      <Twitter className="w-5 h-5 text-blue-400" />
                      <input
                        type="text"
                        value={editForm.social.twitter}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            social: {
                              ...editForm.social,
                              twitter: e.target.value,
                            },
                          })
                        }
                        className="flex-1 bg-transparent focus:outline-none text-white"
                        placeholder="Twitter username"
                      />
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-700 border border-gray-600 rounded-lg">
                      <Instagram className="w-5 h-5 text-pink-400" />
                      <input
                        type="text"
                        value={editForm.social.instagram}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            social: {
                              ...editForm.social,
                              instagram: e.target.value,
                            },
                          })
                        }
                        className="flex-1 bg-transparent focus:outline-none text-white"
                        placeholder="Instagram username"
                      />
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-700 border border-gray-600 rounded-lg">
                      <Linkedin className="w-5 h-5 text-blue-400" />
                      <input
                        type="text"
                        value={editForm.social.linkedin}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            social: {
                              ...editForm.social,
                              linkedin: e.target.value,
                            },
                          })
                        }
                        className="flex-1 bg-transparent focus:outline-none text-white"
                        placeholder="LinkedIn username"
                      />
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-700 border border-gray-600 rounded-lg">
                      <Github className="w-5 h-5 text-white" />
                      <input
                        type="text"
                        value={editForm.social.github}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            social: {
                              ...editForm.social,
                              github: e.target.value,
                            },
                          })
                        }
                        className="flex-1 bg-transparent focus:outline-none text-white"
                        placeholder="GitHub username"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-300"
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

        {isAddCertModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Add New Certification
                </h2>
                <button
                  onClick={() => setIsAddCertModalOpen(false)}
                  className="p-2 hover:bg-gray-700 rounded-full text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Certification Name
                  </label>
                  <input
                    type="text"
                    value={newCertification.name}
                    onChange={(e) =>
                      setNewCertification({
                        ...newCertification,
                        name: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    placeholder="e.g., CompTIA Security+"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Date Achieved
                  </label>
                  <input
                    type="month"
                    value={newCertification.date}
                    onChange={(e) =>
                      setNewCertification({
                        ...newCertification,
                        date: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Score
                  </label>
                  <input
                    type="text"
                    value={newCertification.score}
                    onChange={(e) =>
                      setNewCertification({
                        ...newCertification,
                        score: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    placeholder="e.g., 95%"
                  />
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() => setIsAddCertModalOpen(false)}
                    className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCertification}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                    disabled={
                      !newCertification.name ||
                      !newCertification.date ||
                      !newCertification.score
                    }
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
