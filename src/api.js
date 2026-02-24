// frontend/src/api.js
const API_BASE_URL = 'http://127.0.0.1:3000/spotify'; // Use port 3000 per your main.ts

export const fetchTrackData = async (trackId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/track/${trackId}`);
    if (!response.ok) throw new Error('Track not found');
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};