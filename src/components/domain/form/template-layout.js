export class TemplateLayout {
  #rowGap
  #columnGap

  constructor(rowGap, columnGap) {
    this.#rowGap = rowGap
    this.#columnGap = columnGap
  }

  get rowGap() {
    return this.#rowGap
  }

  get columnGap() {
    return this.#columnGap
  }
}