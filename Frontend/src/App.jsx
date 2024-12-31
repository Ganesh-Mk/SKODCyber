import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Account from './pages/Account';
import Navbar from './Components/Navbar';

const App = () => {
  return (
    <Router>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
    
  );
};

export default App;
