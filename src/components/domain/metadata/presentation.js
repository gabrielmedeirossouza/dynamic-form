export class Presentation {
  #placeholder
  #helperText
  #warningMessage

  constructor({ placeholder, helperText, warningMessage }) {
    this.#placeholder = placeholder
    this.#helperText = helperText
    this.#warningMessage = warningMessage
  }

  get placeholder() {
    return this.#placeholder
  }

  get helperText() {
    return this.#helperText
  }

  get warningMessage() {
    return this.#warningMessage
  }
}