// VideoRoom.js
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:5000");

function VideoRoom({ roomId, userId }) {
  const [peers, setPeers] = useState([]);
  const userVideoRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      userVideoRef.current.srcObject = stream;

      socket.emit("join-room", roomId, userId);

      socket.on("user-connected", remoteUserId => {
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on("signal", data => {
          socket.emit("signal", { userId: remoteUserId, signal: data, roomId });
        });

        socket.on("signal", incoming => {
          if (incoming.userId === userId) {
            peer.signal(incoming.signal);
          }
        });

        setPeers(users => [...users, peer]);
      });
    });
  }, [roomId, userId]);

  return (
    <div>
      <video ref={userVideoRef} autoPlay playsInline muted />
      {/* Render remote peers' video streams here */}
      {peers.map((peer, index) => (
        <Video key={index} peer={peer} />
      ))}
    </div>
  );
}

function Video({ peer }) {
  const ref = useRef();

  useEffect(() => {
    peer.on("stream", stream => {
      ref.current.srcObject = stream;
    });
  }, [peer]);

  return <video ref={ref} autoPlay playsInline />;
}

export default VideoRoom;

