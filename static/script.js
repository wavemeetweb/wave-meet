function joinRoom() {
  const room = document.getElementById("roomInput").value.trim();
  if (room) {
    window.location.href = `/room/${room}`;
  } else {
    alert("Please enter a valid room name.");
  }
}
