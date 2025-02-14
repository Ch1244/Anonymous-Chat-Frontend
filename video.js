const socket = io("https://anonymous-chat-backend-jquo.onrender.com");
let localStream, peerConnection;
const servers = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
const startCallBtn = document.getElementById('startCall');
const endCallBtn = document.getElementById('endCall');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

startCallBtn.addEventListener('click', async () => {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = localStream;
  peerConnection = new RTCPeerConnection(servers);
  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
  peerConnection.onicecandidate = e => e.candidate && socket.emit('ice', e.candidate);
  peerConnection.ontrack = e => remoteVideo.srcObject = e.streams[0];
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  socket.emit('offer', offer);
});

socket.on('offer', async offer => {
  peerConnection = new RTCPeerConnection(servers);
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = localStream;
  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
  peerConnection.onicecandidate = e => e.candidate && socket.emit('ice', e.candidate);
  peerConnection.ontrack = e => remoteVideo.srcObject = e.streams[0];
  await peerConnection.setRemoteDescription(offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  socket.emit('answer', answer);
});

socket.on('answer', answer => peerConnection.setRemoteDescription(answer));
socket.on('ice', candidate => peerConnection.addIceCandidate(candidate));
endCallBtn.addEventListener('click', () => {
  peerConnection.close();
  localStream.getTracks().forEach(track => track.stop());
  socket.emit('endCall');
});
