import { ref } from "vue"

export class FormSizeObserver {
  #rowElement
  #observer = null

  rowWidth = ref(0)

  setRowElement(rowElement) {
    this.#rowElement = rowElement

    this.#observer = new ResizeObserver(() => {
      this.rowWidth.value = this.#rowElement.getBoundingClientRect().width
    });

    this.#observer.observe(this.#rowElement)
  }

  disconnect() {
    this.#observer.disconnect()
  }
}