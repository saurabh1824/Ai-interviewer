const API_BASE = "http://127.0.0.1:8000/api/v1";

export function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found, please login first");
  return {
    Authorization: `Bearer ${token}`,
    
  };
}

export { API_BASE };
