import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MyCourses from './pages/MyCourses';
import ManageAllBlogs from './pages/ManageAllBlogs';
import ManageAllCourses from './pages/ManageAllCourses';
import ManageModules from './pages/ManageModules';
import ManageMyModules from './pages/ManageMyModules';

const App = () => {
  localStorage.setItem('role', 'admin');
  localStorage.setItem('userId', '67a46dbd9e1c926f5f5210e5');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<MyCourses />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="blogs" element={<ManageAllBlogs />} />
          <Route path="manage-courses" element={<ManageAllCourses />} />
          <Route path="manage-modules/:courseId" element={<ManageModules />} />
          <Route path="my-course-module/:courseId" element={<ManageMyModules />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;