import { useState,} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage'; // only if you have registration, otherwise comment it
import TranslatorPage from './components/TranslatorPage';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    // Try loading user from localStorage on app startup
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/translator" />
              ) : (
                <LoginPage onLogin={handleLogin} onSwitchToRegister={() => window.location.href = '/register'} />
              )
            }
          />

          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/translator" />
              ) : (
                <RegisterPage onSwitchToLogin={() => window.location.href = '/'} />
              )
            }
          />

          <Route
            path="/translator"
            element={
              user ? (
                <TranslatorPage onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* fallback: any unknown route redirects home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
  );
}

export default App;
