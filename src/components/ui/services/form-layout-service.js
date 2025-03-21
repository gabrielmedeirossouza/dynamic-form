export class FormLayoutService {
  #formSizeObserver

  constructor(formSizeObserver) {
    this.#formSizeObserver = formSizeObserver
  }

  getFieldWidthInUnits(template, row, column) {
    if (column.layout.size.isFixed) {
      return column.layout.size.value
    }

    const totalUsablePercentageArea = this.getTotalUsablePercentageAreaInUnits(template, row)
    const fieldWidth = totalUsablePercentageArea * (column.layout.size.value / 100)

    return fieldWidth
  }

  getTotalUsablePercentageAreaInUnits(template, row) {
    const fixedColumns = row.columns.filter(c => c.layout.size.isFixed)
    const totalFixedValue = fixedColumns.reduce((acc, c) => acc + c.layout.size.value, 0)
    const totalGap = template.layout.rowGap * (row.columns.length + 1)
    const displayRowWidth = this.#formSizeObserver.rowWidth

    return displayRowWidth - totalFixedValue - totalGap
  }
}