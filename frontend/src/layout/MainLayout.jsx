import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import FloatingNav from '../layout/FloatingNav';
import HomePage from '../pages/HomePage';
import Discover from '../pages/Discover';
import MessagesPage from '../pages/Community';
import RoomPage from '../pages/RoomPage';
import StudyPage from '../pages/StudyPage';
import Calendar from '../pages/Calendar';
import Analytics from '../pages/Analytics';
import ProfilePage from '../pages/ProfilePage';

const MainContainer = styled.div`
  position: relative;
`;

const MainLayout = () => {
  return (
    <MainContainer>
      <FloatingNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/room" element={<RoomPage />} />
        <Route path="/study" element={<StudyPage />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </MainContainer>
  );
};

export default MainLayout;
