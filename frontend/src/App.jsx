import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SessionProvider } from "./context/SessionContext";
import HomePage from './pages/HomePage';
import InterviewPage from './pages/InterviewPage';
import EvaluationPage from './pages/EvaluationPage';

function App() {
  return (
    <SessionProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/evaluation" element={<EvaluationPage />} />
          </Routes>
        </div>
      </Router>
    </SessionProvider>
  );
}

export default App;