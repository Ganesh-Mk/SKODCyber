import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";

const BlogManage = () => {
  const [blogs, setBlogs] = useState(() => {
    return JSON.parse(localStorage.getItem("userBlogs")) || [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deletingBlog, setDeletingBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: "",
    description: "",
    image: "",
  });

  const blogsPerPage = 4;
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (editingBlog) {
          setEditingBlog({ ...editingBlog, image: reader.result });
        } else {
          setNewBlog({ ...newBlog, image: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!newBlog.title || !newBlog.description || !newBlog.image) {
      alert("Please fill all fields");
      return;
    }

    setIsLoading(true);
    
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userID = userData ? userData._id : null;
    console.log(userID);

    const formData = new FormData();
    formData.append("title", newBlog.title);
    formData.append("description", newBlog.description);
    formData.append("userId", userID);
    formData.append("image", dataURItoBlob(newBlog.image));

    try {
      const response = await fetch("http://localhost:3000/createBlog", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Blog created successfully");
        const createdBlog = await response.json();
        setBlogs([...blogs, createdBlog]);
        setNewBlog({ title: "", description: "", image: "" });
        setIsModalOpen(false);
      } else {
        throw new Error("Failed to create blog");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const dataURItoBlob = (dataURI) => {
    let byteString = atob(dataURI.split(",")[1]);
    let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setIsModalOpen(true);
  };

  const handleDelete = (blog) => {
    setDeletingBlog(blog);
  };

  const confirmDelete = () => {
    const updatedBlogs = blogs.filter((blog) => blog.id !== deletingBlog.id);
    setBlogs(updatedBlogs);
    setDeletingBlog(null);
  };

  useEffect(() => {
    localStorage.setItem("userBlogs", JSON.stringify(blogs));
  }, [blogs]);

  const paginatedBlogs = blogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  return (
    <div className="mt-8 bg-gray-800 mb-8 p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">My Blogs</h3>
        <button
          onClick={() => {
            setEditingBlog(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors duration-300"
        >
          <Plus className="w-4 h-4" />
          Create Blog
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-gray-700 rounded-lg overflow-hidden h-64 transform hover:scale-105 transition-transform duration-300 hover:shadow-xl"
            >
              <div className="h-32 overflow-hidden">
                <img
                  src={blog.image || "/api/placeholder/400/300"}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h4 className="text-lg font-semibold text-white mb-2 truncate">
                  {blog.title}
                </h4>
                <p className="text-gray-300 text-sm line-clamp-2">
                  {blog.description}
                </p>
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="p-2 text-blue-400 hover:bg-gray-600 rounded-lg transition-colors duration-200"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(blog)}
                    className="p-2 text-red-400 hover:bg-gray-600 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                currentPage === index + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* Custom Delete Confirmation Dialog */}
      {deletingBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">
              Delete Blog
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "{deletingBlog.title}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeletingBlog(null)}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingBlog ? "Edit Blog" : "Create Blog"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingBlog(null);
                }}
                className="p-2 hover:bg-gray-700 rounded-full text-gray-400 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={editingBlog ? editingBlog.title : newBlog.title}
                  onChange={(e) => {
                    if (editingBlog) {
                      setEditingBlog({ ...editingBlog, title: e.target.value });
                    } else {
                      setNewBlog({ ...newBlog, title: e.target.value });
                    }
                  }}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  value={
                    editingBlog ? editingBlog.description : newBlog.description
                  }
                  onChange={(e) => {
                    if (editingBlog) {
                      setEditingBlog({
                        ...editingBlog,
                        description: e.target.value,
                      });
                    } else {
                      setNewBlog({ ...newBlog, description: e.target.value });
                    }
                  }}
                  rows={3}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Blog Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingBlog(null);
                  }}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg 
                        className="animate-spin h-5 w-5" 
                        viewBox="0 0 24 24"
                      >
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4" 
                          fill="none" 
                        />
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    editingBlog ? "Save Changes" : "Create Blog"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManage;