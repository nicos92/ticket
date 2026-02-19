import { Request, Response } from "express";

export class TicketController {
  constructor() {}

  getTickets = (_req: Request, res: Response): void => {
    res.json("get Tickets");
  };

  getLastTicket = (_req: Request, res: Response): void => {
    res.json("get Last Ticket");
  };

  getPendingTickets = (_req: Request, res: Response): void => {
    res.json("get Pending Tickets");
  };

  createTickets = (_req: Request, res: Response): void => {
    res.json("create Ticket");
  };

  getWorkingOnTicket = (_req: Request, res: Response): void => {
    res.json("get Working On Ticket");
  };

  getDrawTicket = (req: Request, res: Response): void => {
    const { desk } = req.params;
    res.json(`get Draw Ticket - Desk: ${desk}`);
  };

  getDoneTicket = (req: Request, res: Response): void => {
    const { ticketId } = req.params;
    res.json(`get Done Ticket - ID: ${ticketId}`);
  };
}
