import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext';

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const [outfits, setOutfits] = useState([]);
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  const categories = ['Casual', 'Formal', 'Athletic', 'Party', 'Business'];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchOutfits = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${user.id}/outfits?category=${encodeURIComponent(category)}`, {
          withCredentials: true,
        });
        setOutfits(res.data);
      } catch (err) {
        console.error('Error fetching outfits:', err);
        toast.error('Failed to load outfits: ' + (err.response?.data?.error || 'Server error'));
      }
    };
    fetchOutfits();
  }, [user, category, navigate]);

  const formik = useFormik({
    initialValues: { title: '', description: '', category: '', image: null },
    validationSchema: Yup.object({
      title: Yup.string().min(3, 'Title must be at least 3 characters').required('Required'),
      description: Yup.string().min(10, 'Description must be at least 10 characters').required('Required'),
      category: Yup.string().oneOf(categories, 'Invalid category').required('Required'),
      image: Yup.mixed().required('Image (PNG/JPEG) is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('category', values.category);
      formData.append('image', values.image);
      try {
        const res = await axios.post('http://localhost:5000/api/outfits', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        toast.success('Outfit created');
        setOutfits([...outfits, res.data]);
        resetForm();
      } catch (err) {
        toast.error('Failed to create outfit: ' + (err.response?.data?.error || 'Server error'));
      }
    },
  });

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
        <h2 className="text-3xl font-bold text-white">Profile</h2>
        <div className="flex space-x-6">
          <Link to="/" className="text-white font-medium hover:text-gray-200 transition-colors duration-200">
            Home
          </Link>
          <Link to="/outfits" className="text-white font-medium hover:text-gray-200 transition-colors duration-200">
            All Outfits
          </Link>
          <button
            onClick={handleLogout}
            className="button bg-red-500 hover:bg-red-600 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </nav>
      {user ? (
        <>
          <div className="card mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {user.username}'s Profile
            </h3>
            {user.profile_picture && (
              <img
                src={`http://localhost:5000/Uploads/${user.profile_picture}`}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4 object-cover"
              />
            )}
          </div>
          <form onSubmit={formik.handleSubmit} className="card mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Create New Outfit</h3>
            <div className="mb-4">
              <input
                type="text"
                name="title"
                placeholder="Outfit Title"
                onChange={formik.handleChange}
                value={formik.values.title}
                className="w-full p-3 border rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark backdrop-blur-sm"
              />
              {formik.errors.title && <div className="error">{formik.errors.title}</div>}
            </div>
            <div className="mb-4">
              <textarea
                name="description"
                placeholder="Description"
                onChange={formik.handleChange}
                value={formik.values.description}
                className="w-full p-3 border rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark backdrop-blur-sm"
              />
              {formik.errors.description && <div className="error">{formik.errors.description}</div>}
            </div>
            <div className="mb-4">
              <select
                name="category"
                onChange={formik.handleChange}
                value={formik.values.category}
                className="w-full p-3 border rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark backdrop-blur-sm"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {formik.errors.category && <div className="error">{formik.errors.category}</div>}
            </div>
            <div className="mb-4">
              <input
                type="file"
                name="image"
                accept="image/png,image/jpeg"
                onChange={(event) => formik.setFieldValue('image', event.target.files[0])}
                className="w-full p-3 border rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 backdrop-blur-sm"
              />
              {formik.errors.image && <div className="error">{formik.errors.image}</div>}
            </div>
            <button type="submit" className="button bg-gradient-pink-purple hover:bg-pink-600 focus:ring-primary-light">
              Create Outfit
            </button>
          </form>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">My Outfits</h3>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 mb-6 border rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark backdrop-blur-sm"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence>
              {outfits.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400 bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg backdrop-blur-sm col-span-full">
                  No outfits {category ? `in ${category}` : 'created yet'}.
                </p>
              ) : (
                outfits.map((outfit) => (
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
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{outfit.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2">{outfit.description}</p>
                      <span className="text-blue-500 hover:underline">View Details</span>
                    </Link>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400 bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg backdrop-blur-sm">
          Please log in.
        </p>
      )}
    </div>
  );
}

export default Profile;