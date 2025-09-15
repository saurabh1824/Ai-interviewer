import React, { createContext, useContext, useState, useEffect } from "react";

// Define shape of session
const defaultSession = {
  sessionId: null,
  fullName: "",
  role: "",
  questions: [],
  totalQuestions: 0,
  status: "in_progress",
  score: null,
  feedback: "",
  strengths: [],
  areasForImprovement: [],
  hasEvaluated: false,
  duration: "20 min "
};

const SessionContext = createContext({
  session: defaultSession,
  setSession: () => {},
  clearSession: () => {},
});

// Provider
export const SessionProvider = ({ children }) => {
  const [session, setSessionState] = useState(defaultSession);

  // Load from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem("interviewSession");
    if (savedSession) {
      setSessionState(JSON.parse(savedSession));
    }
  }, []);

  // Save to localStorage whenever session changes
  useEffect(() => {
    if (session.sessionId) {
      localStorage.setItem("interviewSession", JSON.stringify(session));
    } else {
      localStorage.removeItem("interviewSession");
    }
  }, [session]);

  const setSession = (newSession) => {
    setSessionState((prev) => ({ ...prev, ...newSession }));
  };

  const clearSession = () => {
    setSessionState(defaultSession);
    localStorage.removeItem("interviewSession");
  };

  return (
    <SessionContext.Provider value={{ session, setSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
};

// Hook for usage
export const useSession = () => useContext(SessionContext);
