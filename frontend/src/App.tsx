
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './layout/Header';
import ActivityFeed from './pages/ActivityFeed';
import ProfilePage from './pages/ProfilePage';
import { Room } from './rooms/Room';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Header />
                <main className="feed-container">
                    <Routes>
                        <Route path="/" element={<ActivityFeed />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/room" element={<Room />} />
                        {/* Other routes will be added here */}
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
