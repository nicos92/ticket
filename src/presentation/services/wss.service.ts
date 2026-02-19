import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";

interface Options {
  server: Server;
  path?: string;
}
export class WssService {
  private static _instance: WssService;
  private wss: WebSocketServer;

  private constructor(options: Options) {
    const { server, path = "/ws" } = options;
    this.wss = new WebSocketServer({ server, path });
    this.start();
  }
  static get instance(): WssService {
    if (!WssService._instance) {
      throw "WssService is not initilized";
    }

    return WssService._instance;
  }
  static initWebSocketServer(options: Options) {
    WssService._instance = new WssService(options);
  }

  /**
   * Inicia el servidor WebSocket y configura los listeners de eventos.
   */
  public start(): void {
    this.wss.on("connection", (ws: WebSocket) => {
      console.log("Client Connected");

      ws.on("message", (message: string) => {
        console.log(`Received message: ${message}`);
        // Aquí puedes implementar la lógica para manejar los mensajes entrantes
        // Por ejemplo, parsear el mensaje y enrutarlo a una función específica.
      });

      ws.on("close", () => {
        console.log("Client disconnected");
      });

      ws.on("error", (error: Error) => {
        console.error("WebSocket error:", error);
        // Maneja errores específicos de la conexión WebSocket del cliente
      });
    });

    this.wss.on("error", (error: Error) => {
      console.error("WebSocketServer error:", error);
      // Maneja errores del servidor WebSocket (ej. puerto ya en uso)
    });
  }
}
