const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function request(path, options) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch {
    throw new Error("Backend is not running. Start FastAPI on http://localhost:8000 and try again.");
  }

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new Error(body?.detail || "Something went wrong while generating the card.");
  }

  return body;
}

export function processImage(imageFile) {
  const payload = new FormData();
  payload.append("image", imageFile);
  return request("/api/process-image", {
    method: "POST",
    body: payload
  });
}

export function planCard(formData) {
  return request("/api/plan-card", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(toApiPayload(formData))
  });
}

export function generateCard(formData, imageFile) {
  const payload = new FormData();
  const apiPayload = toApiPayload(formData);

  payload.append("image", imageFile);
  Object.entries(apiPayload).forEach(([key, value]) => {
    payload.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
  });

  return request("/api/generate-card", {
    method: "POST",
    body: payload
  });
}

export function toApiPayload(formData) {
  return {
    name: formData.name.trim(),
    age: Number(formData.age),
    relationship: formData.relationship,
    occupation: formData.occupation.trim(),
    interesting_thing: formData.interestingThing.trim(),
    card_type: formData.cardType,
    selected_objects: formData.selectedObjects
  };
}

export { API_BASE_URL };
