import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Code2 } from 'lucide-react';

const TextEditor = ({ 
  onSubmit, 
  placeholder = "Type your answer here..." 
}) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Code2 className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-gray-700">Your Answer</span>
        </div>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          aria-label="Answer input"
        />
        
        <div className="flex justify-end mt-3">
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Send className="h-4 w-4" />
            <span>Submit Answer</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TextEditor;