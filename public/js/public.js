console.log("Público HTML");

const lblTicket01 = document.querySelector("#lbl-ticket-01");
const lblDesk01 = document.querySelector("#lbl-desk-01");
const lblTicket02 = document.querySelector("#lbl-ticket-02");
const lblDesk02 = document.querySelector("#lbl-desk-02");
const lblTicket03 = document.querySelector("#lbl-ticket-03");
const lblDesk03 = document.querySelector("#lbl-desk-03");
const lblTicket04 = document.querySelector("#lbl-ticket-04");
const lblDesk04 = document.querySelector("#lbl-desk-04");

const listaCartel = [
  { lblTicket: lblTicket01, lblDesk: lblDesk01 },
  {
    lblTicket: lblTicket02,
    lblDesk: lblDesk02,
  },
  { lblTicket: lblTicket03, lblDesk: lblDesk03 },
  { lblTicket: lblTicket04, lblDesk: lblDesk04 },
];

async function cargaInicial() {
  const atendiendo = await fetch("/api/ticket/working-on").then((resp) =>
    resp.json(),
  );
  console.log(atendiendo);
  asignarTurnoCartel(atendiendo);
}

function asignarTurnoCartel(atendiendo = []) {
  atendiendo.forEach((atender, idx) => {
    listaCartel[idx].lblTicket.innerHTML = `Ticket: ${atender.number}`;
    listaCartel[idx].lblDesk.innerHTML = atender.handleAtDesk;
  });
}

function connectTowebSockets() {
  const socket = new WebSocket("ws://localhost:3000/ws");
  socket.onmessage = (event) => {
    const msj = JSON.parse(event.data);
    if (msj.type === "on-working-changed") {
      asignarTurnoCartel(msj.payload);
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

(async () => {
  connectTowebSockets();
  await cargaInicial();
})();
