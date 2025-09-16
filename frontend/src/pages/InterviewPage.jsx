import { useState ,useRef ,useEffect } from 'react';
import { motion, AnimatePresence, analyseComplexValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import InterviewForm from '../components/InterviewForm';
import ChatBubble from '../components/ChatBubble';
import VideoDisplay from '../components/VideoDisplay';
import TextEditor from '../components/TextEditor';
import Button from '../components/Button';
import { useSession } from "../context/SessionContext";
import { Mic, SkipForward, X, MessageSquare } from 'lucide-react';
import { getNextQuestion, startInterview ,submitTextAnswer,submitAudioAnswer ,endSession } from "../services/interview";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { useCamera } from "../hooks/useCamera";

const InterviewPage = () => {
  const [showForm, setShowForm] = useState(true);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex ,setCurrentQuestionIndex]=useState(0)
  const { isRecording, audioBlob, startRecording, stopRecording,resetRecording } = useAudioRecorder();
  const { videoRef, startCamera, stopCamera } = useCamera();
  const [isCameraOn, setIsCameraOn] = useState(false);
  const navigate = useNavigate();
  const { session,setSession ,clearSession } = useSession();
  const messagesEndRef = useRef(null);

  const handleToggleCamera = async () => {
    if (isCameraOn) {
      stopCamera();
      setIsCameraOn(false);
    } else {
      await startCamera();
      setIsCameraOn(true);
    }
  };


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  const handleFormSubmit = async ({role , resume ,name}) => {
    
    try {
      setShowForm(false);

      const session = await startInterview(role,resume);
      clearSession();   // resets everything including hasEvaluated

      // Store full session in context
      setSession({
        sessionId: session.session_id,
        fullName: name,
        role,
        questions: session.questions || [],
        totalQuestions: session.questions?.length || 0,
        status: "in_progress",
      });
      
      const q= await getNextQuestion(session.session_id)
      setCurrentQuestion(q.next_question)
      setCurrentQuestionIndex(q.question_id)
      setMessages([{text:q.next_question ,isTyping:false}]);
      setShowForm(false);
      // Start camera automatically
      await startCamera();
      setIsCameraOn(true);


      // You could also keep session_id in state/context
      console.log("Session started:", session);

    } catch (err) {
      alert(err.message || "Could not start interview");
      setShowForm(true);
    }
  };

  const fetchNext= async ()=>{
    const q = await getNextQuestion(session.sessionId)

    if(q.next_question){
      setCurrentQuestion(q.next_question);
      setCurrentQuestionIndex(q.question_id)
      setMessages(prev=>[...prev , {text:q.next_question ,isTyping:false}]);
    }else{
      handleEndInterview();
    }
  }

  const handleTextSubmit = async (text) => {
    // Add user's answer (you could display this if needed)

    const answerObj={
      "question_id":currentQuestionIndex,
      "answer_type":"text",
      "answer_text":text
    }

    await submitTextAnswer(answerObj,session.sessionId)

    console.log(answerObj);
    
 
    // Move to next question
    await fetchNext();
    setShowTextEditor(false);
    
  };

  const handleSkipQuestion = async() => {

    const answerObj={
      "question_id":currentQuestionIndex,
      "answer_type":"text",
      "answer_text":"QUESTION_NOT_ANSWERED"
    }
    
    await submitTextAnswer(answerObj,session.sessionId)
    await fetchNext();
  };

const handleEndInterview = async () => {
  try {
    stopCamera(); // stop camera feed
    const response = await endSession(session.sessionId);

    if (response.message === "Session marked as completed") {
      stopCamera(); // stop camera when session ends
      setIsCameraOn(false);
      navigate('/evaluation');
    } else {
      alert(response.message);
    }
  } catch (err) {
    console.error("Error ending session:", err);
  }
};



  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation showAuthButtons={false} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center min-h-[calc(100vh-200px)]"
            >
              <InterviewForm onSubmit={handleFormSubmit} />
            </motion.div>
          ) : (
            <motion.div
              key="interview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]"
            >
              {/* Left Panel - User Video & Controls */}
              <div className="space-y-6">
                <VideoDisplay
                isMinimized={showTextEditor}
                videoRef={videoRef}
                isCameraOn={isCameraOn}
                onToggleCamera={handleToggleCamera}
                />
                
                <div className="flex justify-center space-x-4">
                  <Button
                    variant={isRecording ? "danger" : "secondary"}
                    onClick={isRecording ? stopRecording : startRecording}
                    icon={<Mic className="h-4 w-4" />}
                  >
                    {isRecording ? "Stop Recording" : "Record Audio"}
                  </Button>

                  {audioBlob && (
                    <Button
                      variant="primary"
                      onClick={async () => {
                        const formData = new FormData();
                        formData.append("question_id", currentQuestionIndex);
                        formData.append("audio_file", audioBlob, "answer.wav");

                        try {
                          await submitAudioAnswer(session.sessionId, formData);
                          resetRecording();
                          await fetchNext(); // move to next question
                        } catch (err) {
                          console.error("Upload failed:", err);
                        }
                      }}
                    >
                      Submit Answer
                    </Button>
                  )}
                  
                  <Button
                    variant="secondary"
                    onClick={handleSkipQuestion}
                    icon={<SkipForward className="h-4 w-4" />}
                  >
                    Skip Question
                  </Button>
                  
                  <Button
                    variant="primary"
                    onClick={() => setShowTextEditor(!showTextEditor)}
                    icon={<MessageSquare className="h-4 w-4" />}
                  >
                    Answer in Text
                  </Button>
                  
                  <Button
                    variant="danger"
                    onClick={handleEndInterview}
                    icon={<X className="h-4 w-4" />}
                  >
                    End Interview
                  </Button>
                </div>

                <AnimatePresence>
                  {showTextEditor && (
                    <TextEditor onSubmit={handleTextSubmit} />
                  )}
                </AnimatePresence>
              </div>

              {/* Right Panel - AI Interviewer */}
              <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-[calc(100vh-200px)]">
                {/* Sticky Header */}
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">AI</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AI Interviewer</h3>
                    <p className="text-sm text-green-600">● Active</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2 "
                style={{ maxHeight: "60vh" }}>
                  {messages.map((msg, index) => (
                    <ChatBubble 
                      key={index} 
                      message={msg.text} 
                      isTyping={msg.isTyping} 
                    />
                  ))}
                  <div ref={messagesEndRef} /> {/* Invisible anchor */}
                </div> 
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InterviewPage;