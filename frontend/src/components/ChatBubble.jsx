import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const ChatBubble = ({ message, isTyping = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start space-x-3 mb-4"
    >
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <Bot className="h-5 w-5 text-white" />
        </div>
      </div>
      
      <div className="flex-1">
        <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
          {isTyping ? (
            <div className="flex space-x-1">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                className="w-2 h-2 bg-gray-400 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 bg-gray-400 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 bg-gray-400 rounded-full"
              />
            </div>
          ) : (
            <p className="text-gray-800 leading-relaxed">{message}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatBubble;