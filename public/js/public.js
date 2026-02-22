// public.js

/**
 * Configuration
 */
const CONFIG = {
  API_BASE: "/api/ticket",
  WS_URL: "ws://localhost:3000/ws",
  RECONNECT_DELAY: 1500,
  DESK_COUNT: 4,
};

/**
 * TicketDisplay - Handles DOM elements for a single desk display
 * Single Responsibility: Manages one desk's UI
 */
class TicketDisplay {
  constructor(deskId) {
    const formattedId = String(deskId).padStart(2, "0");
    this.ticketLabel = document.querySelector(`#lbl-ticket-${formattedId}`);
    this.deskLabel = document.querySelector(`#lbl-desk-${formattedId}`);
  }

  update(ticketNumber, deskName) {
    if (this.ticketLabel && this.deskLabel) {
      this.ticketLabel.innerHTML = `Ticket: ${ticketNumber}`;
      this.deskLabel.innerHTML = deskName;
    }
  }

  clear() {
    if (this.ticketLabel) this.ticketLabel.innerHTML = "";
    if (this.deskLabel) this.deskLabel.innerHTML = "";
  }
}

/**
 * TicketBoard - Manages all desk displays
 * Single Responsibility: Coordinates multiple TicketDisplay instances
 */
class TicketBoard {
  constructor(deskCount) {
    this.displays = Array.from(
      { length: deskCount },
      (_, i) => new TicketDisplay(i + 1),
    );
  }

  updateAll(workingOn = []) {
    this.displays.forEach((display, index) => {
      const ticket = workingOn[index];
      if (ticket) {
        display.update(ticket.number, ticket.handleAtDesk);
      } else {
        display.clear();
      }
    });
  }
}

/**
 * TicketAPI - Handles HTTP communication
 * Single Responsibility: API calls only
 */
class TicketAPI {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async getWorkingOn() {
    const response = await fetch(`${this.baseUrl}/working-on`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return response.json();
  }
}

/**
 * WebSocketManager - Handles WebSocket connection and reconnection
 * Single Responsibility: WebSocket lifecycle
 */
class WebSocketManager {
  constructor(url, onMessage, onReconnect) {
    this.url = url;
    this.onMessage = onMessage;
    this.onReconnect = onReconnect;
    this.socket = null;
    this.reconnectTimer = null;
    this.isFirstConnection = true;
  }

  connect() {
    this.socket = new WebSocket(this.url);
    this.socket.onopen = () => {
      console.log("Connected");
      // On reconnect (not first connection), reload initial data
      if (!this.isFirstConnection && this.onReconnect) {
        this.onReconnect();
      }
      this.isFirstConnection = false;
    };
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.onMessage(message);
    };
    this.socket.onclose = () => {
      console.log("Connection Closed");
      this.scheduleReconnect();
    };
    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  scheduleReconnect() {
    this.reconnectTimer = setTimeout(() => {
      console.log("Retrying connection...");
      this.connect();
    }, CONFIG.RECONNECT_DELAY);
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.socket) this.socket.close();
  }
}

/**
 * PublicApp - Main application controller
 * Single Responsibility: Orchestrates all components
 */
class PublicApp {
  constructor() {
    this.board = new TicketBoard(CONFIG.DESK_COUNT);
    this.api = new TicketAPI(CONFIG.API_BASE);
    this.ws = null;
  }

  async initialize() {
    try {
      await this.loadInitialData();
      this.setupWebSocket();
    } catch (error) {
      console.error("Initialization failed:", error);
    }
  }

  async loadInitialData() {
    const workingOn = await this.api.getWorkingOn();
    this.board.updateAll(workingOn);
  }

  setupWebSocket() {
    this.ws = new WebSocketManager(
      CONFIG.WS_URL,
      (message) => this.handleWebSocketMessage(message),
      () => this.loadInitialData(),
    );
    this.ws.connect();
  }

  handleWebSocketMessage(message) {
    if (message.type === "on-working-changed") {
      this.board.updateAll(message.payload);
    }
  }
}

// Bootstrap the application
const app = new PublicApp();
app.initialize();
