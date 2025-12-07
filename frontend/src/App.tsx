
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './layout/Header';
import ActivityFeed from './pages/ActivityFeed';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Header />
                <main className="feed-container">
                    <Routes>
                        <Route path="/" element={<ActivityFeed />} />
                        {/* Other routes will be added here */}
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
