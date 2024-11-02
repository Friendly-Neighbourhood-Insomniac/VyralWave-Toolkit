import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SEOTools } from './components/SEOTools';
import { YouTubeTools } from './components/youtube/YouTubeTools';
import { WaveBackground } from './components/WaveBackground';

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
        <WaveBackground />
        <Sidebar />
        <main className="flex-1 p-8 relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/seo" element={<SEOTools />} />
            <Route path="/youtube" element={<YouTubeTools />} />
            <Route path="/calendar" element={<div>Content Calendar</div>} />
            <Route path="/hashtags" element={<div>Hashtag Analytics</div>} />
            <Route path="/settings" element={<div>Settings</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}