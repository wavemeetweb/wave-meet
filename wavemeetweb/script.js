const myVideo = document.getElementById('my-video');
const peerVideo = document.getElementById('peer-video');
const peerIdInput = document.getElementById('peer-id-input');

const myPeer = new Peer(); // auto-generate ID from PeerJS Cloud
let localStream;

// Display own Peer ID
myPeer.on('open', id => {
  alert("Your Peer ID: " + id + "\nSend this to your friend to connect.");
});

// Get camera + mic
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
  localStream = stream;
  myVideo.srcObject = stream;

  // When someone calls you
  myPeer.on('call', call => {
    call.answer(stream);
    call.on('stream', remoteStream => {
      peerVideo.srcObject = remoteStream;
    });
  });
});

function callPeer() {
  const peerId = peerIdInput.value.trim();
  if (!peerId) return alert("Enter a peer ID to call!");

  const call = myPeer.call(peerId, localStream);
  call.on('stream', remoteStream => {
    peerVideo.srcObject = remoteStream;
  });
}

