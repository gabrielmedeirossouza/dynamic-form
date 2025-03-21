export class FormSizeObserver {
  #rowElement
  #observer = null

  rowWidth

  setRowElement(rowElement) {
    this.#rowElement = rowElement

    this.#observer = new ResizeObserver(() => {
      this.rowWidth = this.#rowElement.getBoundingClientRect().width
    });

    this.#observer.observe(this.#rowElement)
  }

  disconnect() {
    this.#observer.disconnect()
  }
}