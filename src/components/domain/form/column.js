import { ColumnLayout } from "./column-layout"
import { Size } from "./size"

export class Column {
  #id
  #metadataId
  #layout

  constructor(id, metadataId, layout) {
    this.#id = id
    this.#metadataId = metadataId
    this.#layout = layout
  }

  get id() {
    return this.#id
  }

  get metadataId() {
    return this.#metadataId
  }

  get layout() {
    return this.#layout
  }

  changeSize(type, value, min) {
    const size = new Size(type, value, min)
    this.#layout = new ColumnLayout(size)
  }

  resize(value, min) {
    const size = new Size(
      this.layout.size.type,
      value,
      min
    )
    this.#layout = new ColumnLayout(size)
  }
}