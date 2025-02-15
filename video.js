// Establish Socket.io Connection
const socket = io();

// Video Elements
const videoGrid = document.getElementById('video-grid');
let localStream;
let peerConnection;

// STUN Server Configuration
const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

// Start Call Function
async function startCall() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    const videoElement = document.createElement('video');
    addVideoStream(videoElement, localStream);

    peerConnection = new RTCPeerConnection(configuration);
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('candidate', event.candidate);
      }
    };

    peerConnection.ontrack = event => {
      const remoteVideo = document.createElement('video');
      addVideoStream(remoteVideo, event.streams[0]);
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit('offer', offer);

  } catch (error) {
    console.error('Error starting call:', error);
  }
}

// Function to Add Video Stream
function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
}

// End Call Function
function endCall() {
  if (peerConnection) {
    peerConnection.close();
  }
  socket.emit('endCall');
  location.reload();
}

// Socket Listeners
socket.on('offer', async offer => {
  if (!peerConnection) {
    startCall();
  }
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  socket.emit('answer', answer);
});

socket.on('answer', answer => {
  peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on('candidate', candidate => {
  peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
});

socket.on('endCall', () => {
  if (peerConnection) peerConnection.close();
  location.reload();
});
