import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 15;
  const DEFAULT_NEWS_IMAGE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200' width='400' height='200'%3E%3Crect width='400' height='200' fill='%23f3f4f6'/%3E%3Cg fill='%236b7280'%3E%3Cpath d='M160 80h80v40h-80z'/%3E%3Ccircle cx='200' cy='70' r='20'/%3E%3Crect x='140' y='130' width='120' height='6' rx='3'/%3E%3Crect x='160' y='145' width='80' height='6' rx='3'/%3E%3C/g%3E%3C/svg%3E`;

  useEffect(() => {
    const fetchNews = async () => {
      const apiKey = "aa828320dbe94748a74f508cf0490535";
      console.log("API: ", apiKey);
      const url = `https://newsapi.org/v2/everything?q=cybersecurity&pageSize=50&apiKey=${apiKey}`;

      try {
        console.log("Fetching news...");
        setLoading(true);

        const data = await axios.get(url);
        console.log("Fetched news:", data.data);

        // Enhanced validation
        const validArticles = data.data.articles.filter(article =>
          article.title &&
          article.title !== '[Removed]' &&
          article.description &&
          article.description !== '[Removed]' &&
          article.url &&
          article.url !== 'https://removed.com' &&
          article.urlToImage
        );

        console.log("Validated articles:", validArticles);
        setArticles(validArticles);
      } catch (err) {
        console.log("Error fetching news:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Smooth scroll to top when page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentPage]);

  // Filter articles based on search query and selected source
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = selectedSource === 'all' || article.source?.name === selectedSource;
    return matchesSearch && matchesSource;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSource]);

  // Get unique sources for filter dropdown
  const sources = ['all', ...new Set(articles.map(article => article.source?.name).filter(Boolean))];

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Pagination controls
  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center space-x-4 mt-8">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            } ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''} transition-colors`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Page {currentPage} of {totalPages}
        </div>

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            } ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''} transition-colors`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-red-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading News</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-16 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={` z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto px-4 py-4 pl-14">
          {/* Header layout changes */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold">Cybersecurity News</h1>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className={`pl-10 pr-4 py-2 rounded-lg w-full ${darkMode
                    ? 'bg-gray-700 border-gray-600 focus:bg-gray-600'
                    : 'bg-gray-100 border-gray-200 focus:bg-white'
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-row gap-4 w-full justify-between md:justify-start">
                <select
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg ${darkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-gray-100 border-gray-200'
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                >
                  {sources.map(source => (
                    <option key={source} value={source}>
                      {source.charAt(0).toUpperCase() + source.slice(1)}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-lg ${darkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors`}
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`animate-pulse rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="mb-6 text-gray-500">
              Showing {indexOfFirstArticle + 1}-{Math.min(indexOfLastArticle, filteredArticles.length)} of {filteredArticles.length} articles
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentArticles.map((article, index) => (
                <article
                  key={index}
                  className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'
                    } shadow-lg hover:shadow-xl transition-shadow duration-300`}
                >
                  {article.urlToImage && (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = DEFAULT_NEWS_IMAGE;
                        e.target.alt = "News template image";
                      }}
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {article.source?.name}
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatDate(article.publishedAt)}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold mb-2 line-clamp-2">
                      {article.title}
                    </h2>
                    <p className={`mb-4 line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 font-medium"
                      >
                        Read more →
                      </a>
                      {article.author && (
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          By {article.author}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <PaginationControls />
          </>
        )}
      </main>
    </div>
  );
};

export default News;