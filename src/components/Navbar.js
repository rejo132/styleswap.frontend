import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { DarkModeContext } from '../context/DarkModeContext';
import axios from 'axios';

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err.response?.data || err.message);
      alert('Logout failed: ' + (err.response?.data?.error || 'Server error'));
    }
  };

  return (
    <nav className="bg-gradient-pink-purple p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-gray-200 transition-colors duration-200">
          StyleSwap
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-white font-medium hover:text-gray-200 transition-colors duration-200">
            Home
          </Link>
          <Link to="/outfits" className="text-white font-medium hover:text-gray-200 transition-colors duration-200">
            All Outfits
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="text-white font-medium hover:text-gray-200 transition-colors duration-200">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="text-white font-medium hover:text-gray-200 transition-colors duration-200">
                Signup
              </Link>
              <Link to="/login" className="text-white font-medium hover:text-gray-200 transition-colors duration-200">
                Login
              </Link>
            </>
          )}
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;