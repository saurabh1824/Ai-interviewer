// import React from 'react';
// import { motion } from 'framer-motion';
// import { Camera, CameraOff } from 'lucide-react';

// const VideoDisplay = ({ isMinimized = false }) => {
//   return (
//     <motion.div
//       layout
//       transition={{ duration: 0.4, ease: 'easeInOut' }}
//       className={`bg-gray-900 rounded-2xl overflow-hidden shadow-lg ${
//         isMinimized ? 'h-48' : 'h-80'
//       }`}
//     >
//       <div className="relative h-full flex items-center justify-center">
//         <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
        
//         <div className="relative z-10 text-center">
//           <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
//             <Camera className="h-8 w-8 text-gray-400" />
//           </div>
//           <p className="text-gray-300 text-sm">Camera Preview</p>
//           <p className="text-gray-500 text-xs mt-1">Your video will appear here</p>
//         </div>
        
//         <div className="absolute bottom-4 right-4 flex space-x-2">
//           <button className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
//             <CameraOff className="h-5 w-5 text-white" />
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default VideoDisplay;

import { motion } from "framer-motion";
import { CameraOff } from "lucide-react";

const VideoDisplay = ({ isMinimized = false, videoRef, onToggleCamera, isCameraOn }) => {
  return (
    <motion.div
      layout
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={`bg-gray-900 rounded-2xl overflow-hidden shadow-lg ${
        isMinimized ? "h-48" : "h-80"
      }`}
    >
      <div className="relative h-full flex items-center justify-center">
        {/* Video Feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay when camera is off */}
        {!isCameraOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 z-10">
            <p className="text-gray-300 text-sm">Camera is off</p>
            <p className="text-gray-500 text-xs mt-1">Turn it on to start preview</p>
          </div>
        )}

        {/* Camera toggle button */}
        <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
          <button
            onClick={onToggleCamera}
            className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <CameraOff className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoDisplay;
