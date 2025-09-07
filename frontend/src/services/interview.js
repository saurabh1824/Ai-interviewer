import { API_BASE, getAuthHeaders } from "./apiClient";

export async function startInterview(role, resumeFile) {
  const formData = new FormData();
  formData.append("role", role);
  formData.append("resume", resumeFile);

  const response = await fetch(`${API_BASE}/interview/start`, {
    method: "POST",
    headers:getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to start interview");
  return response.json();
}


export async function getNextQuestion(sessionId){

  const response = await fetch(`${API_BASE}/interview/next_question/${sessionId}`,{
    method :"GET",
    headers:getAuthHeaders()
  });
  
  if (!response){
    throw new Error("Failed to fetch next question");
  }
  return response.json()
}

export async function submitTextAnswer(answerObj ,sessionId){

  const response =await fetch(`${API_BASE}/interview/submite_answer_text/${sessionId}`,{
    method:"POST",
    headers:{
      ...getAuthHeaders(),
      "Content-Type":"application/json"
    },
    body:JSON.stringify(answerObj)
  });

  if(!response){
    throw new Error("failed to submit text answer");
  }

  return response.json()
  
}