import { Router } from "express";
import { TicketController } from "./controller";

export class TicketRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new TicketController();

    const routes = [
      { method: "get", path: "/", handler: controller.getTickets },
      { method: "get", path: "/last", handler: controller.getLastTicket },
      {
        method: "get",
        path: "/pending",
        handler: controller.getPendingTickets,
      },
      { method: "post", path: "/", handler: controller.createTickets },
      {
        method: "get",
        path: "/working-on",
        handler: controller.getWorkingOnTicket,
      },
      { method: "get", path: "/draw/:desk", handler: controller.getDrawTicket },
      {
        method: "put",
        path: "/done/:ticketId",
        handler: controller.getDoneTicket,
      },
    ] as const;

    routes.forEach(({ method, path, handler }) => {
      router[method](path, handler);
    });

    return router;
  }
}
