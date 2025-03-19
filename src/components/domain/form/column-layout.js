export class ColumnLayout {
  #size

  constructor(size) {
    this.#size = size
  }

  get size() {
    return this.#size
  }
}