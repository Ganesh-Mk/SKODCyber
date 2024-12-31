import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Account from './pages/Account';
import Navbar from './Components/Navbar';
import News from './pages/News';


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/account" element={<Account />} />
        <Route path="/news" element={<News />} />
      </Routes>
    </Router>

  );
};

export default App;
