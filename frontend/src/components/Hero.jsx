import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Users, Award, Clock } from 'lucide-react';

const Hero = () => {
  const features = [
    { icon: CheckCircle, text: 'AI-powered mock interviews' },
    { icon: Users, text: 'Industry-specific scenarios' },
    { icon: Award, text: 'Detailed performance feedback' },
    { icon: Clock, text: 'Available 24/7' }
  ];

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Master Your Next
            <span className="text-blue-600 block">Job Interview</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Practice with our AI interviewer, get real-time feedback, and boost your confidence. 
            Tailored questions for your role, industry insights, and actionable improvement suggestions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <Link
              to="/interview"
              className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Mock Interview
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center p-4">
                <feature.icon className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm text-gray-600 text-center">{feature.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;