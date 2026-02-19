import { Request, Response } from "express";
import { TicketService } from "../services/ticket.service";

export class TicketController {
  constructor(private readonly ticketService = new TicketService()) {}

  getTickets = (_req: Request, res: Response): void => {
    res.json(this.ticketService.tickets);
  };

  getLastTicket = (_req: Request, res: Response): void => {
    res.json(this.ticketService.lastTicketNumber);
  };

  getPendingTickets = (_req: Request, res: Response): void => {
    res.json(this.ticketService.pendingTickets);
  };

  createTickets = (_req: Request, res: Response): void => {
    res.status(201).json(this.ticketService.createTicker);
  };

  getWorkingOnTicket = (_req: Request, res: Response): void => {
    res.json(this.ticketService.lastWorkingOnTockets);
  };

  getDrawTicket = (req: Request, res: Response): void => {
    const { desk } = req.params;
    res.json(this.ticketService.drawTicket(desk));
  };

  getDoneTicket = (req: Request, res: Response): void => {
    const { ticketId } = req.params;
    res.json(this.ticketService.onFinishedTicket(ticketId));
  };
}
