import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: Yup.object({
      username: Yup.string().min(3, 'Username must be at least 3 characters').required('Required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        await login(values.username, values.password);
        toast.success('Logged in successfully');
        navigate('/profile');
      } catch (err) {
        toast.error('Login failed: ' + err);
      }
    },
  });

  return (
    <motion.div
      className="container mx-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Toaster />
      <nav className="flex justify-between items-center mb-6 bg-gradient-pink-purple p-4 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-white">Login</h2>
        <div className="flex space-x-6">
          <Link to="/" className="text-white font-medium hover:text-gray-200 transition-colors duration-200">
            Home
          </Link>
          <Link to="/outfits" className="text-white font-medium hover:text-gray-200 transition-colors duration-200">
            All Outfits
          </Link>
        </div>
      </nav>
      <form onSubmit={formik.handleSubmit} className="card max-w-md mx-auto">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Sign In</h3>
        <div className="mb-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={formik.handleChange}
            value={formik.values.username}
            className="w-full p-3 border rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark backdrop-blur-sm"
          />
          {formik.errors.username && <div className="error">{formik.errors.username}</div>}
        </div>
        <div className="mb-4 relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            onChange={formik.handleChange}
            value={formik.values.password}
            className="w-full p-3 border rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark backdrop-blur-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
          {formik.errors.password && <div className="error">{formik.errors.password}</div>}
        </div>
        <button type="submit" className="button bg-gradient-pink-purple hover:bg-pink-600 focus:ring-primary-light">
          Login
        </button>
      </form>
      <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-500 hover:underline">
          Signup
        </Link>
      </p>
    </motion.div>
  );
}

export default Login;