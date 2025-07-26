// VideoRoom.js
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

// Change this to your signaling server URL
const SOCKET_SERVER_URL = "http://localhost:5000";

const socket = io(SOCKET_SERVER_URL);

function VideoRoom({ roomId, userId }) {
  const [peers, setPeers] = useState([]);
  const userVideoRef = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    // Get user media stream (video + audio)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      // Show local stream
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }

      socket.emit("join-room", { roomId, userName: userId });

      // Listen for users already in the room to connect to
      socket.on("user-connected", ({ id: userId, userName }) => {
        const peer = createPeer(userId, socket.id, stream);
        peersRef.current.push({ peerID: userId, peer });
        setPeers(users => [...users, peer]);
      });

      // Listen for signaling data from others
      socket.on("signal", ({ from, signal }) => {
        const item = peersRef.current.find(p => p.peerID === from);
        if (item) {
          item.peer.signal(signal);
        } else {
          // If peer does not exist, create and signal back
          const peer = addPeer(signal, from, stream);
          peersRef.current.push({ peerID: from, peer });
          setPeers(users => [...users, peer]);
        }
      });

      // Listen for disconnected users
      socket.on("user-disconnected", userId => {
        const peerObj = peersRef.current.find(p => p.peerID === userId);
        if (peerObj) {
          peerObj.peer.destroy();
        }
        peersRef.current = peersRef.current.filter(p => p.peerID !== userId);
        setPeers(peersRef.current.map(p => p.peer));
      });
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      peersRef.current.forEach(({ peer }) => peer.destroy());
    };
  }, [roomId, userId]);

  // Create a WebRTC peer as initiator
  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    });

    peer.on("signal", signal => {
      socket.emit("signal", { signal, to: userToSignal, from: callerID });
    });

    return peer;
  }

  // Create a WebRTC peer as responder
  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream
    });

    peer.on("signal", signal => {
      socket.emit("signal", { signal, to: callerID, from: socket.id });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <div>
      <video
        ref={userVideoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "300px", borderRadius: "8px", margin: "5px" }}
      />
      {peers.map((peer, index) => (
        <PeerVideo key={index} peer={peer} />
      ))}
    </div>
  );
}

function PeerVideo({ peer }) {
  const ref = useRef();

  useEffect(() => {
    peer.on("stream", stream => {
      if (ref.current) {
        ref.current.srcObject = stream;
      }
    });
    // Cleanup if needed
    return () => {
      peer.removeAllListeners("stream");
    };
  }, [peer]);

  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      style={{ width: "300px", borderRadius: "8px", margin: "5px" }}
    />
  );
}

export default VideoRoom;
