import { UuidAdapter } from "../../config/uuid.adapter";
import { Ticket } from "../../domain/interfaces/ticket";

export class TicketService {
  public tickets: Ticket[] = [
    { id: UuidAdapter.v4(), number: 1, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 2, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 3, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 4, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 5, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 6, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 7, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 8, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 9, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 10, createdAt: new Date(), done: false },
  ];

  public get getTickets(): Ticket[] {
    return [...this.tickets].sort((a, b) => b.number - a.number);
  }

  private readonly workingOnTickets: Ticket[] = [];

  public get pendingTickets(): Ticket[] {
    return this.tickets.filter((ticket) => !ticket.handleAtDekt);
  }
  public get lastWorkingOnTockets(): Ticket[] {
    return this.workingOnTickets.splice(0, 4);
  }
  public get lastTicketNumber() {
    return this.tickets.at(-1)?.number ?? 0;
  }

  public createTicker(): Ticket {
    const newTicket: Ticket = {
      id: UuidAdapter.v4(),
      number: this.lastTicketNumber + 1,
      createdAt: new Date(),
      done: false,
      handleAt: undefined,
      handleAtDekt: undefined,
    };
    this.tickets.push(newTicket);

    // TODO: conectar con web socket
    //
    return newTicket;
  }

  public drawTicket(desk: string) {
    const ticket = this.tickets.find((ticket) => !ticket.handleAtDekt);
    if (!ticket)
      return { status: "error", message: " No hay tickets pendientes" };

    ticket.handleAtDekt = desk;
    ticket.handleAt = new Date();

    this.workingOnTickets.unshift({ ...ticket });
    // TODO: conectar con web socket
    //
    return { status: "ok", ticket };
  }

  public onFinishedTicket(id: string) {
    const ticket = this.tickets.find((ticket) => ticket.id === id);
    if (!ticket) return { status: "error", message: "Ticket no encontrado" };

    ticket.done = true;

    return { status: "ok" };
  }
}
