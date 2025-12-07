
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './layout/Header';
import ActivityFeed from './pages/ActivityFeed';
import ProfilePage from './pages/ProfilePage';
import { Room } from './rooms/Room';
import { AuthProvider, useAuth } from './hooks/useAuth';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AuthenticatedApp />
      </Router>
    </AuthProvider>
  );
};

const AuthenticatedApp: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return (
    <div className="app-container">
      {user && <Header />}
      <main className="feed-container">
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<ActivityFeed />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/room" element={<Room />} />
              {/* Other routes will be added here */}
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
};

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default App;
