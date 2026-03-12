// Dynamic loader for face-api.js to avoid build issues
export async function loadFaceApi() {
  if (typeof window !== 'undefined') {
    // Only load in browser environment
    try {
      const faceapi = await import('face-api.js');
      return faceapi;
    } catch (error) {
      console.error('Failed to load face-api.js:', error);
      throw error;
    }
  }
  return null;
}

// Preload models with error handling
export async function loadFaceApiModels() {
  const faceapi = await loadFaceApi();
  if (!faceapi) {
    throw new Error('face-api.js could not be loaded');
  }

  try {
    // Load models with error handling
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models')
    ]);
    
    return faceapi;
  } catch (error) {
    console.error('Failed to load face-api.js models:', error);
    throw error;
  }
}
