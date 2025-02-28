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
import BlogManage from "../Components/BlogManage";
import CourseManage from "../Components/CourseManage";
import axios from "axios"; // Make sure axios is installed
import Stats from "../Components/Stats";

const Account = () => {
  const [userData, setUserData] = useState([]);
  const [quizzesGiven, setQuizzesGiven] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);
  const [badges, setBadges] = useState("0");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    ...userData,
    social: userData.social || {
      twitter: "",
      instagram: "",
      linkedin: "",
      github: "",
    },
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [isAddCertModalOpen, setIsAddCertModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newCertification, setNewCertification] = useState({
    name: "",
    issuer: "",
    date: "",
    expiry: "",
    credentialId: "",
  });
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    // Calculate cumulative count of modules per month
    return modules.map((_, index) => ({
      month:
        monthNames[
        (currentDate.getMonth() - (modules.length - 1) + index + 12) % 12
        ],
      modules: index + 1, // Cumulative count
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
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem("userData"));
        const userId = userData ? userData._id : null;
        const response = await axios.get(`${BACKEND_URL}/user/${userId}`);

        // Ensure response.data has a social object
        const userDataWithSocial = {
          ...response.data,
          social: response.data.social || {
            twitter: "",
            instagram: "",
            linkedin: "",
            github: "",
          },
        };

        setUserData(userDataWithSocial);
        // Also update the editForm with the new data
        setEditForm(userDataWithSocial);

        console.log("User Data : ", userData);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch user data");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

  const saveChanges = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Create FormData object
      const formData = new FormData();

      // Get userId from localStorage or wherever it's stored
      const userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData ? userData._id : null;

      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      // Add user info to FormData
      formData.append("userId", userId);
      formData.append("name", editForm.name);
      formData.append("email", editForm.email);
      formData.append("about", editForm.about);

      // Add social media data as JSON string
      formData.append(
        "social",
        JSON.stringify({
          twitter: editForm.social.twitter || "",
          instagram: editForm.social.instagram || "",
          linkedin: editForm.social.linkedin || "",
          github: editForm.social.github || "",
        })
      );

      // Add stats if needed
      formData.append("modulesCompleted", completedModules.length);
      formData.append("quizzesCompleted", quizzesGiven);
      formData.append("badges", badges);

      // Handle profile image
      // If imagePreview is set and it's not the same as the original image,
      // it means a new file was selected
      if (imagePreview && imagePreview !== userData.image) {
        // For base64 data URLs
        if (imagePreview.startsWith("data:")) {
          // Extract the base64 string (remove the data:image/xxx;base64, part)
          const base64Data = imagePreview.split(",")[1];
          // Convert to binary
          const binaryString = window.atob(base64Data);
          // Create array buffer
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          // Create blob and then file
          const blob = new Blob([bytes.buffer], { type: "image/jpeg" });
          const imageFile = new File([blob], "profile-image.jpg", {
            type: "image/jpeg",
          });
          formData.append("profileImage", imageFile);
        }
      }

      // Send request to backend
      const response = await axios.post(`${BACKEND_URL}/updateUser`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        // Update local state
        setUserData(response.data.user);
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        setIsEditModalOpen(false);
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // Add this line to see the detailed error response from the server
      if (error.response)
        console.error("Server response:", error.response.data);
      setErrorMessage(
        error.message || "An error occurred while updating your profile"
      );
    } finally {
      setIsLoading(false);
    }
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

  // Helper function to prepend http:// if missing from URL
  const formatUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;
  };

  // Function to handle social media URL redirection
  const handleSocialLinkClick = (platform) => {
    if (!userData.social || !userData.social[platform]) return;

    let url;
    switch (platform) {
      case "twitter":
        url = formatUrl(
          userData.social.twitter.includes("twitter.com") ||
            userData.social.twitter.includes("x.com")
            ? userData.social.twitter
            : `https://twitter.com/${userData.social.twitter}`
        );
        break;
      case "instagram":
        url = formatUrl(
          userData.social.instagram.includes("instagram.com")
            ? userData.social.instagram
            : `https://instagram.com/${userData.social.instagram}`
        );
        break;
      case "linkedin":
        url = formatUrl(
          userData.social.linkedin.includes("linkedin.com")
            ? userData.social.linkedin
            : `https://linkedin.com/in/${userData.social.linkedin}`
        );
        break;
      case "github":
        url = formatUrl(
          userData.social.github.includes("github.com")
            ? userData.social.github
            : `https://github.com/${userData.social.github}`
        );
        break;
      default:
        return;
    }

    window.open(url, "_blank");
  };

  const SocialIcons = () => {
    // Add a safety check
    if (!userData.social) return null;

    return (
      <div className="flex gap-4 mt-4 flex-wrap">
        {userData.social.twitter && (
          <div className="relative group">
            <Twitter
              className="w-5 h-5 text-blue-400 cursor-pointer hover:text-blue-300 transition-colors"
              onClick={() => handleSocialLinkClick("twitter")}
            />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-gray-700 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {userData.social.twitter}
            </div>
          </div>
        )}
        {userData.social.instagram && (
          <div className="relative group">
            <Instagram
              className="w-5 h-5 text-pink-400 cursor-pointer hover:text-pink-300 transition-colors"
              onClick={() => handleSocialLinkClick("instagram")}
            />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-gray-700 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {userData.social.instagram}
            </div>
          </div>
        )}
        {userData.social.linkedin && (
          <div className="relative group">
            <Linkedin
              className="w-5 h-5 text-blue-400 cursor-pointer hover:text-blue-300 transition-colors"
              onClick={() => handleSocialLinkClick("linkedin")}
            />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-gray-700 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {userData.social.linkedin}
            </div>
          </div>
        )}
        {userData.social.github && (
          <div className="relative group">
            <Github
              className="w-5 h-5 text-white cursor-pointer hover:text-gray-300 transition-colors"
              onClick={() => handleSocialLinkClick("github")}
            />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-gray-700 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {userData.social.github}
            </div>
          </div>
        )}
      </div>
    );
  };

  const SkeletonLoader = () => (
    <div className="flex-1 text-center md:text-left animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="h-8 bg-gray-700 rounded-md w-48"></div>
        <div className="h-10 bg-gray-700 rounded-lg w-32"></div>
      </div>
      <div className="h-4 bg-gray-700 rounded-md w-40 mt-2"></div>
      <div className="h-16 bg-gray-700 rounded-md w-full max-w-2xl mt-4"></div>
      <div className="flex gap-4 mt-4">
        <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
        <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
        <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
      </div>
    </div>
  );

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

            {loading ? (
              <SkeletonLoader />
            ) : (
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
            )}
          </div>
        </div>

        <Stats />



        <BlogManage />
        <CourseManage />





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

              {errorMessage && (
                <div className="bg-red-900 text-white p-3 rounded-lg mb-4">
                  {errorMessage}
                </div>
              )}

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
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveChanges}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
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