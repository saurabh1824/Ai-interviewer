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
import { getNextQuestion, startInterview ,submitTextAnswer ,endSession } from "../services/interview";

const InterviewPage = () => {
  const [showForm, setShowForm] = useState(true);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex ,setCurrentQuestionIndex]=useState(0)
  const navigate = useNavigate();
  const { session,setSession ,clearSession } = useSession();
  const messagesEndRef = useRef(null);

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
    console.log(answerObj);
    await submitTextAnswer(answerObj,session.sessionId)
    await fetchNext();
  };

const handleEndInterview = async () => {
  try {
    const response = await endSession(session.sessionId);

    if (response.message === "Session marked as completed") {
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
                <VideoDisplay isMinimized={showTextEditor} />
                
                <div className="flex justify-center space-x-4">
                  <Button
                    variant="secondary"
                    onClick={() => {/* Record audio logic */}}
                    icon={<Mic className="h-4 w-4" />}
                  >
                    Record Audio
                  </Button>
                  
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