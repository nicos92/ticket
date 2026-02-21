const lblPending = document.querySelector("#lbl-pending");
const noHayMasTickets = document.querySelector("#no-hay-mas-tickets");
const escritorio = document.querySelector("#escritorio");
const btnDone = document.querySelector("#btn-done");
const btnDraw = document.querySelector("#btn-draw");
const lblTicketActual = document.querySelector("small");

const params = new URLSearchParams(window.location.search);
if (!params.has("escritorio")) {
  window.location = "index.html";
  throw new Error("Escritorio es requerido");
}

const numeroEscritorio = params.get("escritorio");
escritorio.innerHTML = numeroEscritorio;
let ticketActual = null;
async function loadInitialCount() {
  const pending = await fetch("/api/ticket/pending").then((resp) =>
    resp.json(),
  );
  chekearCantidadTickets(pending.length);
}

async function getTicket() {
  const { status, ticket, message } = await fetch(
    `/api/ticket/draw/${numeroEscritorio}`,
  ).then((resp) => resp.json());

  if (status === "error") {
    lblTicketActual.innerHTML = message;
    return;
  }

  ticketActual = ticket;
  lblTicketActual.innerHTML = ticket.number;
}

function connectTowebSockets() {
  const socket = new WebSocket("ws://localhost:3000/ws");
  socket.onmessage = (event) => {
    const msj = JSON.parse(event.data);
    if (msj.type === "on-ticket-count-changed") {
      chekearCantidadTickets(msj.payload);
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

function nombreEscritorio() {}
function chekearCantidadTickets(cantidad = 0) {
  if (cantidad === 0) {
    noHayMasTickets.classList.remove("d-none");
  } else {
    noHayMasTickets.classList.add("d-none");
  }
  lblPending.innerHTML = cantidad;
}

btnDraw.addEventListener("click", getTicket);
loadInitialCount();
connectTowebSockets();
