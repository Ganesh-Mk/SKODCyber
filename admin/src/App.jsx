import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MyCourses from './pages/MyCourses';
import ManageAllBlogs from './pages/ManageAllBlogs';
import ManageAllCourses from './pages/ManageAllCourses';
import ManageModules from './pages/ManageModules';
import MyModules from './pages/MyModules';
import ManageAllUsers from './pages/ManageAllUsers';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<MyCourses />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="blogs" element={<ManageAllBlogs />} />
          <Route path="manage-courses" element={<ManageAllCourses />} />
          <Route path="manage-users" element={<ManageAllUsers />} />
          <Route path="manage-modules/:courseId" element={<ManageModules />} />
          <Route path="my-course-module/:courseId" element={<MyModules />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;