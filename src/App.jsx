import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [history, setHistory] = useState([
    { id: 1, title: "The Flying Machine", date: "Today" },
    { id: 2, title: "City of Tomorrow", date: "Yesterday" },
    { id: 3, title: "Ocean Cleanup", date: "Last Week" },
    { id: 4, title: "Mars Colony", date: "Last Week" }
  ]);

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage history={history} setHistory={setHistory} />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/history" element={<HistoryPage history={history} setHistory={setHistory} />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;

