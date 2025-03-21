import { AssertionConcern } from "../../base/assertion-concern"
import { Row } from "./row"

export class Template {
  #id
  #layout
  #breakpoint
  #rows

  constructor(id, layout, rows, draft = false) {
    this.#id = id
    this.#layout = layout
    this.#rows = rows
    this.draft = draft
    this.#calculateBreakpoint()
  }

  get id() {
    return this.#id
  }

  get layout() {
    return this.#layout
  }

  get breakpoint() {
    return this.#breakpoint
  }

  get rows() {
    return this.#rows
  }

  moveColumn(columnId, position, targetColumnId) {
    AssertionConcern.assertArgumentOneOf('position', position, ['before', 'after'])

    if (columnId === targetColumnId) return

    const columnRow = this.#rows.find(row => row.columns.some(column => column.id === columnId))
    if (!columnRow) throw new Error(`Column with id ${columnId} not found.`)

    const targetRow = this.#rows.find(row => row.columns.some(column => column.id === targetColumnId))
    if (!targetRow) throw new Error(`Row with target column id ${targetColumnId} not found.`)

    const column = columnRow.columns.find(column => column.id === columnId)
    columnRow.deleteColumn(columnId)
    targetRow.addColumnNextTo(column, position, targetColumnId)

    this.#removeEmptyRows()
    this.#calculateBreakpoint()
  }

  moveColumnToNewRow(columnId, rowPosition, targetRowId) {
    AssertionConcern.assertArgumentOneOf('position', rowPosition, ['before', 'after'])

    const columnRow = this.#rows.find(row => row.columns.some(column => column.id === columnId))
    if (!columnRow) throw new Error(`Column with id ${columnId} not found.`)

    const indexTargetRow = this.#rows.findIndex(row => row.id === targetRowId)
    if (indexTargetRow === -1) throw new Error(`Target row with id ${targetRowId} not found.`)

    const column = columnRow.columns.find(column => column.id === columnId)
    columnRow.deleteColumn(columnId)

    if (column.layout.size.isPercentage) {
      column.resize(100, column.layout.size.min)
    }

    const newRow = new Row(crypto.randomUUID(), [column])

    if (rowPosition === 'before') {
      this.#rows.splice(indexTargetRow, 0, newRow)
    } else {
      this.#rows.splice(indexTargetRow + 1, 0, newRow)
    }

    this.#removeEmptyRows()
    this.#calculateBreakpoint()
  }

  changeColumnType(columnId, type) {
    const row = this.getRowByColumnId(columnId)
    row.changeColumnType(columnId, type)
  }

  resizeColumn(columnId, value, min) {
    const row = this.getRowByColumnId(columnId)
    row.resizeColumn(columnId, value, min)
  }

  getRowByColumnId(columnId) {
    for (const row of this.#rows) {
      if (!row.existsColumn(columnId)) continue

      return row
    }

    throw new Error(`Column with id ${columnId} does not exists.`)
  }

  getRowById(rowId) {
    const row = this.#rows.find(r => r.id === rowId)
    if (!row) throw new Error(`Row with id ${rowId} doest not exists.`)

    return row
  }

  getColumnById(columnId) {
    for (const row of this.#rows) {
      if (!row.existsColumn(columnId)) continue

      return row.getColumnById(columnId)
    }

    throw new Error(`Column with id ${columnId} does not exists.`)
  }

  getTotalRowPercentageUsage(rowId) {
    const row = this.getRowById(rowId)
    return row.getTotalRowPercentageUsage()
  }

  #removeEmptyRows() {
    this.#rows = this.#rows.filter(row => row.columns.length > 0)
  }

  #calculateBreakpoint() {
    const breakpointRows = this.#rows.map(row => row.breakpoint)
    const breakpoint = Math.max(...breakpointRows)
    this.#breakpoint = breakpoint
  }
}