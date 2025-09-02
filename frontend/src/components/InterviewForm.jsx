import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, User, Briefcase } from 'lucide-react';

const InterviewForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [resume, setResume] = useState(null);

  const roles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Software Engineer',
    'DevOps Engineer',
    'Data Scientist',
    'Product Manager',
    'UI/UX Designer'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && role) {
      onSubmit({ name, role, resume });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setResume(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Setup</h2>
        <p className="text-gray-600">Tell us about yourself to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline h-4 w-4 mr-1" />
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            <Briefcase className="inline h-4 w-4 mr-1" />
            Target Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            required
          >
            <option value="">Select a role</option>
            {roles.map((roleOption) => (
              <option key={roleOption} value={roleOption}>
                {roleOption}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
            <Upload className="inline h-4 w-4 mr-1" />
            Resume (Optional)
          </label>
          <div className="relative">
            <input
              type="file"
              id="resume"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          {resume && (
            <p className="text-sm text-green-600 mt-1">✓ {resume.name}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Start Interview
        </button>
      </form>
    </motion.div>
  );
};

export default InterviewForm;