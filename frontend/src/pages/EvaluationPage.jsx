import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import CircularScore from '../components/CircularScore';
import Button from '../components/Button';
import { RotateCcw, Clock, Target, MessageSquare } from 'lucide-react';

const EvaluationPage = () => {
  const navigate = useNavigate();

  const sessionData = {
    role: 'Frontend Developer',
    questionsAsked: 4,
    totalScore: 78,
    duration: '12 min 30 sec'
  };

  const feedback = [
    {
      category: 'Strengths',
      points: [
        'Excellent communication skills and clear explanations',
        'Strong understanding of React and modern web technologies',
        'Good problem-solving approach with logical thinking'
      ],
      color: 'green'
    },
    {
      category: 'Areas for Improvement',
      points: [
        'Could provide more specific examples from past projects',
        'Consider discussing performance optimization techniques',
        'Practice explaining complex concepts in simpler terms'
      ],
      color: 'yellow'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation showAuthButtons={false} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Panel - Session Details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">Session Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-400">Role</p>
                    <p className="font-semibold text-white">{sessionData.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-400">Questions Asked</p>
                    <p className="font-semibold text-white">{sessionData.questionsAsked}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-400">Duration</p>
                    <p className="font-semibold text-white">{sessionData.duration}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Circular Score Display */}
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex justify-center">
                <CircularScore score={sessionData.totalScore} maxScore={100} size={140} />
              </div>
            </div>

            <div className="space-y-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => navigate('/interview')}
                icon={<RotateCcw className="h-4 w-4" />}
              >
                Retry Interview
              </Button>
            </div>
          </div>

          {/* Right Panel - Feedback */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detailed Feedback */}
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">Interview Feedback</h2>
              
              <div className="space-y-6">
                {feedback.map((section, index) => (
                  <motion.div
                    key={section.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  >
                    <h3 className={`font-semibold mb-3 ${
                      section.color === 'green' ? 'text-green-700' : 'text-yellow-700'
                    }`}>
                      {section.category}
                    </h3>
                    <ul className="space-y-2">
                      {section.points.map((point, pointIndex) => (
                        <li key={pointIndex} className="flex items-start space-x-2">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            section.color === 'green' ? 'bg-green-500' : 'bg-yellow-500'
                          }`} />
                          <span className="text-gray-300 leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Additional Insights */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 border border-blue-800">
              <h3 className="font-semibold text-white mb-3">Next Steps</h3>
              <p className="text-gray-300 leading-relaxed">
                Based on your performance, consider practicing more technical questions and 
                preparing specific examples from your projects. Focus on articulating your 
                thought process clearly and asking thoughtful questions about the role.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EvaluationPage;