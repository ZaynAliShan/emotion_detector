const video = document.getElementById("video");

//promise all will return ture if all are ture otherwise false
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'), //makes detecting small and efficient
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'), //makes a net of dots aroung face that will describe face
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'), //makes box around face for recognition
  faceapi.nets.faceExpressionNet.loadFromUri('/models'), //for emotion net of face
]).then(startVideo) //show video after loading all models and it's a success scenario

function startVideo() {
  navigator.getUserMedia (
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video); //making a canvas to show face detections and box
  document.body.append(canvas); //attaching canvas to body
  
  const displaySize = //object
  { 
    width: video.width,
    height: video.height
  }
  faceapi.matchDimensions(canvas, displaySize); //matching face api with our canvas and it's display size

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, //detecting all faces with landmarks and expressions, using asynchornization function for awaitng of faceapi every 100sec
    new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawDetections(canvas, resizedDetections);//drawing detections
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);//drawing lips/nose/eyes etc landmarks
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections); //draws expressions along with detections and landmarks
  }, 100)
})