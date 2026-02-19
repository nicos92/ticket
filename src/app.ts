import { createServer } from "http";
import { envs } from "./config/envs";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";
import { WssService } from "./presentation/services/wss.service";

(async () => {
  main();
})();

function main() {
  const PORT = envs.PORT;
  const server = new Server({
    port: PORT,
    routes: AppRoutes.routes,
  });
  const httpServer = createServer(server.app);
  WssService.initWebSocketServer({ server: httpServer });

  httpServer.listen(PORT, () => {
    console.log(`👂 HTTP Server listening on port ${PORT}`);
  });
}
