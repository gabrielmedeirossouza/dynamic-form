export class UndefinedBehaviour extends Error {
  constructor() {
    super("Conditional was not handled, leading to undefined behaviour.");
  }
}
