import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext';

function OutfitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [outfit, setOutfit] = useState(null);
  const [rating, setRating] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = ['Casual', 'Formal', 'Athletic', 'Party', 'Business'];

  useEffect(() => {
    const fetchOutfit = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/outfits/${id}`, { withCredentials: true });
        setOutfit(res.data);
      } catch (err) {
        console.error('Error fetching outfit:', err);
        toast.error('Failed to load outfit: ' + (err.response?.data?.error || 'Server error'));
      } finally {
        setLoading(false);
      }
    };
    fetchOutfit();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      title: outfit?.title || '',
      description: outfit?.description || '',
      category: outfit?.category || '',
      image: null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().min(3, 'Title must be at least 3 characters').required('Required'),
      description: Yup.string().min(10, 'Description must be at least 10 characters').required('Required'),
      category: Yup.string().oneOf(categories, 'Invalid category').required('Required'),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('category', values.category);
      if (values.image) formData.append('image', values.image);
      try {
        await axios.put(`http://localhost:5000/api/outfits/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        toast.success('Outfit updated');
        setIsEditing(false);
        const res = await axios.get(`http://localhost:5000/api/outfits/${id}`, { withCredentials: true });
        setOutfit(res.data);
      } catch (err) {
        toast.error('Update failed: ' + (err.response?.data?.error || 'Server error'));
      }
    },
  });

  const handleRating = async () => {
    if (!rating || rating < 1 || rating > 5) {
      toast.error('Please enter a rating between 1 and 5');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5000/api/ratings',
        { score: parseInt(rating), outfit_id: id },
        { withCredentials: true }
      );
      toast.success('Rating submitted');
      setRating('');
      const res = await axios.get(`http://localhost:5000/api/outfits/${id}`, { withCredentials: true });
      setOutfit(res.data);
    } catch (err) {
      toast.error('Rating failed: ' + (err.response?.data?.error || 'Server error'));
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/outfits/${id}`, { withCredentials: true });
      toast.success('Outfit deleted');
      navigate('/profile');
    } catch (err) {
      toast.error('Delete failed: ' + (err.response?.data?.error || 'Server error'));
    }
  };

  const handleShare = () => {
    const shareUrl = `https://x.com/intent/tweet?text=Check out my outfit on StyleSwap!&url=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(shareUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="text-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark mx-auto"></div>
      </div>
    );
  }

  if (!outfit) {
    return <div className="text-center p-6 text-gray-600 dark:text-gray-400 bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg backdrop-blur-sm">Outfit not found.</div>;
  }

  return (
    <motion.div
      className="container mx-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Toaster />
      <nav className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{outfit.title}</h2>
        <Link to="/profile" className="text-blue-500 hover:underline">Back to Profile</Link>
      </nav>
      {isEditing ? (
        <form onSubmit={formik.handleSubmit} className="card mb-6">
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
          <div className="flex space-x-4">
            <button type="submit" className="button bg-gradient-pink-purple hover:bg-pink-600 focus:ring-primary-light">
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="button bg-gray-500 hover:bg-gray-600 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="card">
          <img
            src={`http://localhost:5000/Uploads/${outfit.image}`}
            alt={outfit.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <p className="text-gray-600 dark:text-gray-400 mb-2">{outfit.description}</p>
          <p className="text-gray-500 dark:text-gray-300 mb-2">Category: {outfit.category}</p>
          <p className="text-gray-500 dark:text-gray-300 mb-4">
            Average Rating: {outfit.average_rating ? outfit.average_rating.toFixed(1) : 'No ratings yet'}
          </p>
          <div className="mb-4 flex items-center">
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="p-3 border rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark w-20 backdrop-blur-sm"
              placeholder="1-5"
            />
            <button
              onClick={handleRating}
              className="ml-2 button bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
            >
              Submit Rating
            </button>
          </div>
          {user && user.id === outfit.user_id && (
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setIsEditing(true)}
                className="button bg-green-500 hover:bg-green-600 focus:ring-green-500"
              >
                Edit Outfit
              </button>
              <button
                onClick={handleDelete}
                className="button bg-red-500 hover:bg-red-600 focus:ring-red-500"
              >
                Delete Outfit
              </button>
            </div>
          )}
          <button
            onClick={handleShare}
            className="button bg-blue-400 hover:bg-blue-500 focus:ring-blue-400"
          >
            Share on X
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default OutfitDetail;