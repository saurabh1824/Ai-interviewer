import React from 'react';
import { motion } from 'framer-motion';

const ScoreCard = ({ 
  title, 
  score, 
  maxScore, 
  color = 'blue' 
}) => {
  const percentage = (score / maxScore) * 100;
  
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
    green: 'text-green-600 bg-green-50 border-green-200',
    yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    red: 'text-red-600 bg-red-50 border-red-200'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${colorClasses[color]}`}>
          {score}/{maxScore}
        </span>
      </div>
      
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`h-3 rounded-full ${
              color === 'blue' ? 'bg-blue-600' :
              color === 'green' ? 'bg-green-600' :
              color === 'yellow' ? 'bg-yellow-600' :
              'bg-red-600'
            }`}
          />
        </div>
        <span className="absolute right-0 top-4 text-sm text-gray-600">
          {Math.round(percentage)}%
        </span>
      </div>
    </motion.div>
  );
};

export default ScoreCard;