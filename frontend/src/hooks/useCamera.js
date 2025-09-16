// import { useState, useRef } from "react";

// export function useCamera() {
//   const [stream, setStream] = useState(null);
//   const videoRef = useRef(null);
//   const streamRef = useRef(null);

//   // Start camera
//   const startCamera = async () => {
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       setStream(mediaStream);

//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//       }
//     } catch (err) {
//       console.error("Camera access denied:", err);
//       alert("Camera access is required to proceed with the interview.");
//     }
//   };

//   // Stop camera
//   const stopCamera = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//       setStream(null);
//     }
//   };

//   return { videoRef, startCamera, stopCamera };
// }

import { useRef } from "react";

export function useCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true, 
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Error starting camera:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      // stop both video & audio tracks
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return { videoRef, startCamera, stopCamera };
}
