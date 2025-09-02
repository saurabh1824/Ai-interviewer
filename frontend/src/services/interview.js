import { API_BASE, getAuthHeaders } from "./apiClient";

export async function startInterview(role, resumeFile) {
  const formData = new FormData();
  formData.append("role", role);
  formData.append("resume", resumeFile);

  const response = await fetch(`${API_BASE}/interview/start`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to start interview");
  return response.json();
}
