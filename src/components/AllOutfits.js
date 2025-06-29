import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AllOutfits() {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/outfits', { withCredentials: true });
        setOutfits(res.data.outfits || []);
      } catch (err) {
        console.error('Error fetching outfits:', err.response?.data || err.message);
        toast.error('Failed to load outfits: ' + (err.response?.data?.error || 'Server error'));
      } finally {
        setLoading(false);
      }
    };
    fetchOutfits();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <Toaster />
      <nav className="flex justify-between items-center mb-6 bg-gradient-pink-purple p-4 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white">All Outfits</h1>
        <Link to="/" className="text-white font-medium hover:text-gray-200 transition-colors duration-200">
          Back to Home
        </Link>
      </nav>
      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark mx-auto"></div>
        </div>
      ) : outfits.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg backdrop-blur-sm">No outfits available.</p>
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

export default AllOutfits;