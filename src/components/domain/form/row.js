import { AssertionConcern } from "../../base/assertion-concern"

export class Row {
  constructor(id, columns) {
    this.id = id
    this.columns = columns
  }

  get breakpoint() {
    return this.columns.reduce((acc, column) => {
      return acc + column.layout.size.staticValue
    }, 0)
  }

  get #percentageUsage() {
    const percentageColumns = this.columns.filter(c => c.layout.size.isPercentage)
    const percentageUsage = percentageColumns.reduce((acc, column) => {
      return acc + column.layout.size.value
    }, 0)

    return percentageUsage
  }

  get #percentageRemaining() {
    return 100 - this.#percentageUsage
  }

  get #percentageProportion() {
    const percentageColumns = this.columns.filter(c => c.layout.size.isPercentage)
    return 100 / percentageColumns.length
  }

  get #hasAvailablePercentageSpace() {
    return this.#percentageRemaining >= 20
  }

  addColumnNextTo(column, position, targetColumnId) {
    AssertionConcern.assertArgumentOneOf('position', position, ['before', 'after'])

    if (column.layout.size.isPercentage && this.#hasAvailablePercentageSpace) {
      column.resize(this.#percentageRemaining, column.layout.size.min)
    }

    const hasAvailablePercentageSpace = this.#hasAvailablePercentageSpace
    const targetIndex = this.#getColumnIndexById(targetColumnId)

    if (position === 'before') {
      this.columns.splice(targetIndex, 0, column)
    } else {
      this.columns.splice(targetIndex + 1, 0, column)
    }

    if (column.layout.size.isPercentage && !hasAvailablePercentageSpace) {
      this.#resizeProportionalPercentageColumns()
    }
  }

  deleteColumn(columnId) {
    const columnIndex = this.#getColumnIndexById(columnId)
    this.columns.splice(columnIndex, 1)
  }

  changeColumnType(columnId, type) {
    const column = this.getColumnById(columnId)
    if (column.layout.size.type === type) return

    if (type === "fixed") {
      column.changeSize("fixed", column.layout.size.min)
      return
    }

    if (this.#hasAvailablePercentageSpace) {
      column.changeSize("percentage", this.#percentageRemaining, column.layout.size.min)
      return
    }

    column.changeSize("percentage", this.#percentageProportion, column.layout.size.min)
    this.#resizeProportionalPercentageColumns()
  }

  resizeColumn(columnId, value, min) {
    const column = this.getColumnById(columnId)

    if (column.layout.size.isFixed) {
      column.resize(value)
      return
    }

    column.resize(value, min)
  }

  existsColumn(columnId) {
    return this.columns.some(c => c.id === columnId)
  }

  calculateBreakpoint(column) {
    return this.breakpoint + column.layout.size.staticValue
  }

  getColumnById(columnId) {
    const column = this.columns.find(c => c.id === columnId)
    if (!column) throw new Error(`Column with id ${columnId} does not exists.`)

    return column
  }

  #resizeProportionalPercentageColumns() {
    for (const column of this.columns) {
      if (column.layout.size.isFixed) continue
      column.resize(this.#percentageProportion, column.layout.size.min)
    }
  }

  #getColumnIndexById(columnId) {
    const index = this.columns.findIndex(column => column.id === columnId)
    if (index === -1) throw new Error(`Column with id ${columnId} not found in row ${this.id}.`)

    return index
  }
}