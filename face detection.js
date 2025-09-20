const video = document.getElementById("video");
const canvas = document.getElementById("overlay");
const context = canvas.getContext("2d");

// Load face-api.js models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js/weights"),
  faceapi.nets.faceLandmark68Net.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js/weights"),
  faceapi.nets.faceRecognitionNet.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js/weights"),
  faceapi.nets.faceExpressionNet.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js/weights"),
]).then(startVideo);

function startVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: {} })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((err) => console.error("Error accessing webcam:", err));
}

video.addEventListener("play", () => {
  canvas.width = video.width;
  canvas.height = video.height;

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw detections
    faceapi.draw.drawDetections(canvas, detections);
    faceapi.draw.drawFaceLandmarks(canvas, detections);

    // Draw emotions above each face
    detections.forEach((detection) => {
      const box = detection.detection.box;
      const expressions = detection.expressions;
      const maxValue = Math.max(...Object.values(expressions));
      const emotion = Object.keys(expressions).find(
        (key) => expressions[key] === maxValue
      );

      context.fillStyle = "yellow";
      context.font = "18px Arial";
      context.fillText(emotion, box.x, box.y - 10);
    });
  }, 100);
});
