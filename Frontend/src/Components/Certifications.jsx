import React, { useState, useEffect } from "react";
import { Download, Award } from "lucide-react";
import axios from "axios";

const Certifications = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        // Get completed courses from localStorage
        const completedCourses = JSON.parse(localStorage.getItem("completedCourses") || "[]");

        if (completedCourses.length === 0) {
          setLoading(false);
          return;
        }

        // Convert array to comma-separated string for API call
        const courseIds = completedCourses.join(",");

        // Fetch course data from backend
        const response = await axios.get(`${BACKEND_URL}/getCourses?courseIds=${courseIds}`);
        setCertificates(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching certificates:", err);
        setError("Failed to load your certificates. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [BACKEND_URL]);

  const downloadCertificate = (course) => {
    // Get user data
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const username = userData.name || "Learner";

    // Create a canvas for the certificate
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");

    // Set background
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add border
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 15;
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

    // Add certificate title
    ctx.font = "bold 50px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("CERTIFICATE OF COMPLETION", canvas.width / 2, 150);

    // Add award icon
    ctx.fillStyle = "#6366f1";
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 250, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 80px Arial";
    ctx.fillText("🏆", canvas.width / 2, 275);

    // Add text
    ctx.fillStyle = "#ffffff";
    ctx.font = "30px Arial";
    ctx.fillText("This certifies that", canvas.width / 2, 350);

    // Add name
    ctx.font = "bold 60px Arial";
    ctx.fillText(username, canvas.width / 2, 430);

    // Add course info
    ctx.font = "30px Arial";
    ctx.fillText("has successfully completed the course", canvas.width / 2, 500);

    // Add course title
    ctx.font = "bold 50px Arial";
    ctx.fillText(course.title, canvas.width / 2, 580);

    // Add date
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    ctx.font = "25px Arial";
    ctx.fillText(`Issued on: ${date}`, canvas.width / 2, 650);

    // Create download link
    const link = document.createElement("a");
    link.download = `${course.title.replace(/\s+/g, "_")}_Certificate.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Award className="mr-2 text-indigo-400" /> My Certificates
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-300">Loading certificates...</span>
        </div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300">
          {error}
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Award className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p className="text-lg">You haven't completed any courses yet.</p>
          <p className="mt-2">Complete a course to earn your first certificate!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((course) => (
            <div
              key={course._id}
              className="bg-gray-900 border-2 border-indigo-600 rounded-lg overflow-hidden flex flex-col transform transition-transform hover:scale-105"
            >
              <div className="bg-indigo-900 p-4 text-center">
                <Award className="w-12 h-12 mx-auto text-yellow-300" />
                <h3 className="text-xl font-bold text-white mt-2">Certificate of Completion</h3>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="text-center flex-1">
                  <p className="text-gray-400 text-sm mb-2">This certifies that</p>
                  <p className="text-white text-xl font-bold mb-2">
                    {JSON.parse(localStorage.getItem("userData") || '{"name":"Learner"}').name}
                  </p>
                  <p className="text-gray-400 text-sm mb-2">has successfully completed</p>
                  <p className="text-indigo-400 text-xl font-bold my-4">{course.title}</p>
                  <p className="text-gray-500 text-sm mt-4">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>

                <button
                  onClick={() => downloadCertificate(course)}
                  className="mt-6 w-full px-4 py-3 bg-indigo-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors duration-300"
                >
                  <Download className="w-4 h-4" />
                  Download Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certifications;