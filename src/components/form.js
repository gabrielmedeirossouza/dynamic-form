import { Row } from "./row";

export class Form {
  constructor(rows, layout) {
    this.rows = rows;
    this.layout = layout;

    for (const row of rows) {
      row.setParent(this);
    }
  }

  moveColumn(columnId, position, targetId) {
    if (columnId === targetId) return;

    const column = this._getColumn(columnId);
    const target = this._getColumn(targetId);

    const deletedColumn = column.delete();

    target.insertAdjacentColumn(deletedColumn, position);
  }

  deleteRow(row) {
    this.rows.splice(this.rows.indexOf(row), 1);
  }

  addColumnToNewRow(columnId) {
    const column = this._getColumn(columnId);

    const deletedColumn = column.delete();

    const newRow = new Row([deletedColumn], {});
    newRow.setParent(this);
    this.rows.push(newRow);
  }

  _getColumn(columnId) {
    for (const row of this.rows) {
      const column = row.attemptGetColumn(columnId);
      if (column) return column;
    }

    throw new Error("Column not found!");
  }
}