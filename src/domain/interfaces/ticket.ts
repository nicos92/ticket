import { Data } from "ws";

export interface Ticket {
  id: string;
  number: number;
  createdAt: Date;
  handleAtDekt?: string;
  handleAt?: Date;
  done: boolean;
}
