import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const [outfits, setOutfits] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOutfits = async () => {
      if (search.trim()) {
        try {
          setLoading(true);
          const res = await axios.get(`http://localhost:5000/api/search?q=${encodeURIComponent(search)}`, {
            withCredentials: true,
          });
          setOutfits(res.data.outfits);
        } catch (err) {
          console.error('Search error:', err.response?.data || err.message);
          toast.error('Failed to load outfits: ' + (err.response?.data?.error || 'Server error'));
        } finally {
          setLoading(false);
        }
      } else {
        setOutfits([]);
      }
    };
    fetchOutfits();
  }, [search]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast.success('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Logout failed: ' + (err.response?.data?.error || 'Server error'));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Toaster />
      <nav className="flex justify-between items-center mb-6 bg-gradient-pink-purple p-4 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white">StyleSwap</h1>
        <div className="flex space-x-6">
          {user ? (
            <>
              <Link to="/profile" className="text-white font-medium hover:text-gray-200 transition-colors duration-200">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="button bg-red-500 hover:bg-red-600 focus:ring-red-500"
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
        </div>
      </nav>
      <input
        type="text"
        placeholder="Search outfits or users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-6 border rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition-all duration-200 backdrop-blur-sm"
      />
      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark mx-auto"></div>
        </div>
      ) : outfits.length === 0 && search.trim() === '' ? (
        <p className="text-center text-gray-600 dark:text-gray-400 bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg backdrop-blur-sm">Enter a search query to find outfits.</p>
      ) : outfits.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg backdrop-blur-sm">No outfits found.</p>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence>
            {outfits.map((outfit) => (
              <motion.div
                key={outfit.id}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Link to={`/outfits/${outfit.id}`}>
                  <img
                    src={`http://localhost:5000/Uploads/${outfit.image}`}
                    alt={outfit.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{outfit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2">{outfit.description}</p>
                  <span className="text-blue-500 hover:underline">View Details</span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

export default Home;