import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CommunityPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const blogsPerPage = 9; // Changed from 12 to 9 to match 3 blogs per row
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


  // Fetch blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/allBlog`);
        setBlogs(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch blogs. Please try again later.');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter blogs based on search term
  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Generate page numbers with a maximum of 5 visible page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    // Adjust startPage if we're near the end
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen mt-16 bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen mt-16 bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-xl text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 bg-[#0a0a0a] text-white">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Header Text */}
          <div className="text-left">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Developer Community
            </h1>
            <p className="text-gray-400 text-lg">
              Connect, Share, and Learn
            </p>
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full md:w-1/2 relative"
          >
            <input
              type="text"
              placeholder="Search blogs..."
              className="w-full pl-12 pr-24 py-3 bg-gray-800/50 border border-gray-700 rounded-xl 
                      text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 
                      focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-1.5 
                      bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                      transition-colors duration-300"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentBlogs.map((blog) => (
            <article
              key={blog._id}
              className="group bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50 
                      hover:border-blue-500/50 transition-all duration-500 
                      hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.3)]"
            >
              {blog.image && (
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
              <div className="p-6">
                <Link to={`/user/${blog.userId}`} className="group-hover:text-blue-400 transition-colors duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <img
                        src={blog.author?.profileImage || '/default-avatar.png'}
                        alt={blog.author?.name || 'Author'}
                        className="w-10 h-10 rounded-full object-cover border-2 border-transparent 
                               group-hover:border-blue-500 transition-all duration-300 cursor-pointer"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full 
                                border-2 border-gray-800"></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-white cursor-pointer hover:text-blue-400 transition-colors duration-300">
                        {blog.userName || 'Anonymous'}
                      </h3>
                      <div className="text-xs text-blue-400">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Link>
                <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 
                            transition-colors duration-300">
                  {blog.title}
                </h2>
                <p className="text-gray-400 line-clamp-2">{blog.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <span>{blog.readTime || '5 min'} read</span>
                    </div>
                    <button
                      onClick={() => navigate(`/blog/${blog._id}`)}
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                    >
                      Read more
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg transition-all duration-300 
                      ${currentPage === 1
                  ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-800 text-white hover:bg-gray-700'}`}
            >
              Previous
            </button>

            {getPageNumbers().map(number => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`w-10 h-10 rounded-lg transition-all duration-300 
                        ${currentPage === number
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg transition-all duration-300 
                      ${currentPage === totalPages
                  ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-800 text-white hover:bg-gray-700'}`}
            >
              Next
            </button>
          </div>
        )}

        {/* Empty State */}
        {currentBlogs.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No results found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;