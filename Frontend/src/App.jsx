import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import './App.css'
import Home from './pages/Home';
import Learn from './pages/Learn';
import Account from './pages/Account';
import Navbar from './Components/Navbar';
import News from './pages/News';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Community from './pages/Community';


const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/account" element={<Account />} />
          <Route path="/news" element={<News />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/community" element={<Community />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
