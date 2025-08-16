const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const emotionText = document.getElementById("emotion-text");

// Load the face-api models
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/models')
]).then(startVideo);

function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => console.error("Error accessing camera:", err));
}

video.addEventListener("play", () => {
    const ctx = canvas.getContext("2d");
    canvas.width = video.width;
    canvas.height = video.height;

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, detections);
        faceapi.draw.drawFaceExpressions(canvas, detections);

        if (detections.length > 0) {
            let expressions = detections[0].expressions;
            let maxEmotion = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
            emotionText.innerText = `Detected Emotion: ${maxEmotion.toUpperCase()}`;
        } else {
            emotionText.innerText = "No face detected";
        }
    }, 100);
});
