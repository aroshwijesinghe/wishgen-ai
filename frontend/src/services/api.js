const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function generateWish(formData) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/api/generate-wish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name.trim(),
        age: Number(formData.age),
        relationship: formData.relationship,
        personality: formData.personality.trim(),
        interesting_thing: formData.interestingThing.trim(),
        sender_name: formData.senderName.trim(),
        template: formData.template
      })
    });
  } catch {
    throw new Error("Backend is not running. Start FastAPI on http://localhost:8000 and try again.");
  }

  const body = await response.json();
  if (!response.ok) {
    throw new Error(formatApiError(body.detail));
  }

  return body;
}

export async function analyzeImage(file) {
  let response;
  const formData = new FormData();
  formData.append("file", file);

  try {
    response = await fetch(`${API_BASE_URL}/api/analyze-image`, {
      method: "POST",
      body: formData
    });
  } catch {
    throw new Error("Backend is not running. Start FastAPI on http://localhost:8000 and try again.");
  }

  const body = await response.json();
  if (!response.ok) {
    throw new Error(formatApiError(body.detail));
  }

  return body;
}

function formatApiError(detail) {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((item) => item.msg || "Invalid input.").join(" ");
  return "Could not generate the birthday wish.";
}

