import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import Learn from './pages/Learn';
import Account from './pages/Account';
import Navbar from './Components/Navbar';
import News from './pages/News';
import Signup from './pages/Signup';
import Login from './pages/Login';


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/account" element={<Account />} />
        <Route path="/news" element={<News />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>

  );
};

export default App;
