const lblPending = document.querySelector("#lbl-pending");

async function loadInitialCount() {
  const pending = await fetch("/api/ticket/pending").then((resp) =>
    resp.json(),
  );
  console.log(pending);
  lblPending.innerHTML = pending.length || 0;
}

function connectTowebSockets() {
  const socket = new WebSocket("ws://localhost:3000/ws");
  socket.onmessage = (event) => {
    const msj = JSON.parse(event.data);
    if (msj.type === "on-ticket-count-changed") {
      lblPending.innerHTML = msj.payload;
    }
  };

  socket.onclose = (event) => {
    console.log("Connection Closed");
    setTimeout(() => {
      console.log("retrying to connect");
      connectTowebSockets();
    }, 1500);
  };

  socket.onopen = (event) => {
    console.log("Connected");
  };
}
loadInitialCount();
connectTowebSockets();
