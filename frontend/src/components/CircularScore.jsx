import React from 'react';
import { motion } from 'framer-motion';

const CircularScore = ({ score, maxScore = 100, size = 120 }) => {
  const percentage = (score / maxScore) * 100;
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Yellow
    if (score >= 40) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };

  const scoreColor = getScoreColor(percentage);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#374151"
            strokeWidth="10"
            fill="transparent"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={scoreColor}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>
        
        {/* Score text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-center"
          >
            <div className="text-2xl font-bold text-white mb-1">
              {score}
            </div>
            <div className="text-xs text-gray-300">
              out of {maxScore}
            </div>
          </motion.div>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="mt-4 text-center"
      >
        <h3 className="text-sm font-semibold text-white mb-1">Overall Score</h3>
        <p className="text-xs text-gray-300">
          {percentage >= 80 ? 'Excellent Performance!' :
           percentage >= 60 ? 'Good Performance' :
           percentage >= 40 ? 'Needs Improvement' :
           'Requires Practice'}
        </p>
      </motion.div>
    </div>
  );
};

export default CircularScore;