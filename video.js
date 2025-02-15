// video.js - Fixed Scope and Socket.IO Path
const socket = io(); // Fix io not defined

let localStream; // Ensure correct scope
let peerConnection;

const iceServers = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

// Start Call
async function startCall() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const videoElement = document.createElement('video');
    addVideoStream(videoElement, localStream);

    socket.emit('join-video-room', 'default-room');
  } catch (error) {
    console.error('Error starting call:', error);
  }
}

// Add Video Stream
function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  document.getElementById('video-grid').append(video);
}

// End Call
function endCall() {
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
  }
  socket.emit('leave-room', 'default-room');
  document.getElementById('video-grid').innerHTML = '';
  document.getElementById('status').innerText = 'Call ended.';
}

// Socket Listeners
socket.on('user-connected', (userId) => {
  document.getElementById('status').innerText = `Connected with ${userId}`;
});

socket.on('user-disconnected', (userId) => {
  document.getElementById('status').innerText = `${userId} disconnected.`;
});
