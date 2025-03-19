export class FormLayoutService { // UI service
  getTotalUsablePercentageAreaInPixels(rowWidth, template, row) {
    const fixedColumns = row.columns.filter(c => c.layout.size.isFixed)
    const totalFixedValue = fixedColumns.reduce((acc, c) => acc + c.layout.size.value, 0)
    const totalGap = template.layout.rowGap * (row.columns.length + 1)

    return rowWidth - totalFixedValue - totalGap
  }

  getFieldWidth(rowWidth, template, row, column) {
    if (column.layout.size.isFixed) {
      return column.layout.size.value
    }

    const columnPercentageToPixel = this.getTotalUsablePercentageAreaInPixels(rowWidth, template, row) * (column.layout.size.value / 100)

    return columnPercentageToPixel
  }

  getTotalRowPercentageUsage(row) {
    const totalUsage = row.columns.reduce((acc, column) => {
      if (!column.layout.size.isPercentage) return acc

      return acc + column.layout.size.value
    }, 0)

    return totalUsage
  }
}