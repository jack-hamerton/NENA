
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './App.css';

const NotificationBar = ({ message }) => {
    if (!message) return null;
    return (
        <motion.div
            className="notification-bar"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            {message}
        </motion.div>
    );
};

const Post = ({ post }) => {
    const { author, content, created_at } = post;
    // Placeholder for logic to determine if a post is a sponsored ad
    const isSponsored = author.id % 5 === 0;

    return (
        <motion.div
            className="post-card"
            layout
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            whileHover={{ scale: 1.03, y: -5 }}
        >
            <div className="post-header">
                <img className="avatar" src={`https://i.pravatar.cc/40?u=${author.id}`} alt={`${author.username}'s avatar`} />
                <div className="author-info">
                    <span className="author-name">{author.username}</span>
                    <span className="post-time">{new Date(created_at).toLocaleString()}</span>
                </div>
                {isSponsored && <span className="sponsored-badge">Sponsored</span>}
            </div>
            <p className="post-content">{content}</p>
        </motion.div>
    );
};

const App = () => {
    const [posts, setPosts] = useState([]);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        // In a real app, you'd replace this with the correct API endpoint
        const apiUrl = '/api/posts/';

        axios.get(apiUrl)
            .then(response => {
                setPosts(response.data);
                setNotification('Feed loaded successfully!');
                setTimeout(() => setNotification(''), 2500);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                setNotification('Failed to load feed.');
                setTimeout(() => setNotification(''), 2500);
            });

        // Placeholder for WebSocket for real-time updates
        // This simulates a new post arriving after a few seconds
        const interval = setInterval(() => {
            const newUser = { id: Math.floor(Math.random() * 100), username: 'NewUser' };
            const newPost = {
                id: Math.random(),
                content: 'This is a new real-time post!',
                created_at: new Date().toISOString(),
                author: newUser,
            };
            setPosts(prevPosts => [newPost, ...prevPosts]);
            setNotification('New post arrived!');
            setTimeout(() => setNotification(''), 2500);
        }, 15000); // Add a new post every 15 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="app-container">
            <AnimatePresence>
                {notification && <NotificationBar message={notification} />}
            </AnimatePresence>
            <header className="app-header">
                <h1>Activity Feed</h1>
            </header>
            <main className="feed-container">
                <AnimatePresence initial={false}>
                    {posts.map(post => (
                        <Post key={post.id} post={post} />
                    ))}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default App;
