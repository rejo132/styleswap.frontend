import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { Toaster } from 'react-hot-toast';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import OutfitDetail from './components/OutfitDetail';
import AllOutfits from './components/AllOutfits';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <DarkModeProvider>
        <Router>
          <div className="min-h-screen bg-background dark:bg-background-dark text-gray-900 dark:text-gray-100 font-poppins transition-colors duration-300">
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-text)',
                },
              }}
            />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/outfits/:id" element={<OutfitDetail />} />
              <Route path="/outfits" element={<AllOutfits />} />
            </Routes>
          </div>
        </Router>
      </DarkModeProvider>
    </AuthProvider>
  );
}

export default App;