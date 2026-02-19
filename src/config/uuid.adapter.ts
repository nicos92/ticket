import { randomUUID } from "crypto";

export class UuidAdapter {
  public static v4() {
    return randomUUID();
  }
}
