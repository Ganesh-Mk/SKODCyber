  import React, { useState, useEffect } from "react";
  import {
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
    ResponsiveContainer,
    LineChart,
    Line,
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
    Plus,
    Trash2,
  } from "lucide-react";
  import BlogManage from "../Components/BlogManage"


  const Account = () => {
    const [userData, setUserData] = useState(() => {
      return (
        JSON.parse(localStorage.getItem("userData")) || {
          name: "Alex Thompson",
          email: "alex.thompson@example.com",
          about:
            "Passionate cybersecurity enthusiast with a focus on network security and penetration testing. Always eager to learn and share knowledge with the community.",
          image: "https://cdn-icons-png.flaticon.com/512/10398/10398223.png",
          social: {  // Make sure this object exists
            twitter: "",
            instagram: "",
            linkedin: "",
            github: "",
          },
          certifications: [],
        }
      );
    });

    const [quizzesGiven, setQuizzesGiven] = useState(0);
    const [completedModules, setCompletedModules] = useState([]);
    const [badges, setBadges] = useState("0");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ ...userData });
    const [imagePreview, setImagePreview] = useState(null);
    const [progressData, setProgressData] = useState([]);
    const [isAddCertModalOpen, setIsAddCertModalOpen] = useState(false);
    const [newCertification, setNewCertification] = useState({
      name: "",
      issuer: "",
      date: "",
      expiry: "",
      credentialId: "",
    });

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

    const prepareAchievementData = () => {
      const totalModules = 10;
      const totalQuizzes = 10;
      const totalBadges = 10;

      return [
        {
          name: "Modules",
          completed: completedModules.length,
          total: totalModules,
        },
        {
          name: "Quizzes",
          completed: parseInt(quizzesGiven),
          total: totalQuizzes,
        },
        {
          name: "Badges",
          completed: parseInt(badges),
          total: totalBadges,
        },
      ];
    };

    useEffect(() => {
      const storedCompletedModules = localStorage.getItem("completedModules");
      const modules = JSON.parse(storedCompletedModules) || [];

      setProgressData(generateProgressData(modules));
      setCompletedModules(modules);
      setBadges(localStorage.getItem("badges") || "0");
      setQuizzesGiven(localStorage.getItem("totalQuizzesGiven") || 0);
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
      const updatedCertifications = [
        ...(userData.certifications || []),
        { ...newCertification, id: Date.now() },
      ];

      const updatedUserData = {
        ...userData,
        certifications: updatedCertifications,
      };

      setUserData(updatedUserData);
      localStorage.setItem("userData", JSON.stringify(updatedUserData));

      setNewCertification({
        name: "",
        issuer: "",
        date: "",
        expiry: "",
        credentialId: "",
      });
      setIsAddCertModalOpen(false);
    };

    const handleRemoveCertification = (id) => {
      const updatedCertifications = (userData.certifications || []).filter(
        (cert) => cert.id !== id
      );

      const updatedUserData = {
        ...userData,
        certifications: updatedCertifications,
      };

      setUserData(updatedUserData);
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
    };

    const SocialIcons = () => {
      // Add a safety check
      if (!userData.social) return null;
    
      return (
        <div className="flex gap-4 mt-4 flex-wrap">
          {userData.social.twitter && (
            <Twitter className="w-5 h-5 text-blue-400 cursor-pointer hover:text-blue-300 transition-colors" />
          )}
          {userData.social.instagram && (
            <Instagram className="w-5 h-5 text-pink-400 cursor-pointer hover:text-pink-300 transition-colors" />
          )}
          {userData.social.linkedin && (
            <Linkedin className="w-5 h-5 text-blue-400 cursor-pointer hover:text-blue-300 transition-colors" />
          )}
          {userData.social.github && (
            <Github className="w-5 h-5 text-white cursor-pointer hover:text-gray-300 transition-colors" />
          )}
        </div>
      );
    };

    return (
      <div className="min-h-screen mt-2 sm:mt-10 pt-20 bg-gray-900 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Profile Section */}
          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <div className="w-36 h-36 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-gray-700">
                  <img
                    src={userData.image || "/api/placeholder/128/128"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    {userData.name}
                  </h1>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors duration-300"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
                <p className="text-gray-400 mt-2">{userData.email}</p>
                <p className="text-gray-300 mt-4 max-w-2xl">{userData.about}</p>
                <SocialIcons />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mb-8">
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
                  <p className="text-3xl font-bold text-green-400">
                    {quizzesGiven}
                  </p>
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

          <BlogManage/>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-white">
                Achievement Progress
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareAchievementData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                      }}
                      formatter={(value, name) => [
                        value,
                        name === "total" ? "Target" : "Completed",
                      ]}
                    />
                    <Bar dataKey="completed" fill="#4F46E5" name="Completed" />
                    <Bar dataKey="total" fill="#6B7280" name="Target" />
                  </BarChart>
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

          {/* Certifications Section */}
          <div className="mt-8 bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Certifications</h3>
              <button
                onClick={() => setIsAddCertModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors duration-300"
              >
                <Plus className="w-4 h-4" />
                Add Certification
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(userData.certifications || []).map((cert) => (
                <div
                  key={cert.id}
                  className="bg-gray-700 p-4 rounded-lg space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-semibold text-white">
                      {cert.name}
                    </h4>
                    <button
                      onClick={() => handleRemoveCertification(cert.id)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-300">Issuer: {cert.issuer}</p>
                  <p className="text-gray-300">Issued: {cert.date}</p>
                  {cert.expiry && (
                    <p className="text-gray-300">Expires: {cert.expiry}</p>
                  )}
                  {cert.credentialId && (
                    <p className="text-gray-300">
                      Credential ID: {cert.credentialId}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add Certification Modal */}
          {isAddCertModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Add Certification
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
                    <label className="block text-gray-300 mb-2">
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
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Issuer</label>
                    <input
                      type="text"
                      value={newCertification.issuer}
                      onChange={(e) =>
                        setNewCertification({
                          ...newCertification,
                          issuer: e.target.value,
                        })
                      }
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Issue Date</label>
                    <input
                      type="date"
                      value={newCertification.date}
                      onChange={(e) =>
                        setNewCertification({
                          ...newCertification,
                          date: e.target.value,
                        })
                      }
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Expiry Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={newCertification.expiry}
                      onChange={(e) =>
                        setNewCertification({
                          ...newCertification,
                          expiry: e.target.value,
                        })
                      }
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Credential ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={newCertification.credentialId}
                      onChange={(e) =>
                        setNewCertification({
                          ...newCertification,
                          credentialId: e.target.value,
                        })
                      }
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      onClick={() => setIsAddCertModalOpen(false)}
                      className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddCertification}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Add Certification
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Profile Modal */}
          {isEditModalOpen && (
            <div className="fixed inset-0 mt-10 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="p-2 hover:bg-gray-700 rounded-full text-gray-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>
      </div>
    );
  };

  export default Account;
