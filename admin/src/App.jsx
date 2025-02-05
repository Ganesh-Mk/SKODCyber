import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MyCourses from './pages/MyCourses';
import ManageAllPosts from './pages/ManageAllPosts';
import ManageAllCourses from './pages/ManageAllCourses';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<MyCourses />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="posts" element={<ManageAllPosts />} />
          <Route path="manage-courses" element={<ManageAllCourses />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;