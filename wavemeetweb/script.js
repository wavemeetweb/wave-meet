const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;
let myStream;

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myStream = stream;
  addVideoStream(myVideo, stream);

  const peer = new Peer();
  peer.on("open", id => {
    console.log("My peer ID is: " + id);
  });

  peer.on("call", call => {
    call.answer(stream);
    const video = document.createElement("video");
    call.on("stream", userVideoStream => {
      addVideoStream(video, userVideoStream);
    });
  });

  document.getElementById("startBtn").addEventListener("click", () => {
    const peerId = prompt("Enter peer ID to connect:");
    const call = peer.call(peerId, stream);
    const video = document.createElement("video");
    call.on("stream", userVideoStream => {
      addVideoStream(video, userVideoStream);
    });
  });
});

document.getElementById("muteBtn").addEventListener("click", () => {
  const enabled = myStream.getAudioTracks()[0].enabled;
  myStream.getAudioTracks()[0].enabled = !enabled;
});

document.getElementById("stopBtn").addEventListener("click", () => {
  const enabled = myStream.getVideoTracks()[0].enabled;
  myStream.getVideoTracks()[0].enabled = !enabled;
});

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
