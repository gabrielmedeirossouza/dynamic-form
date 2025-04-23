import { AssertionConcern } from "../../base/assertion-concern";
import { UndefinedBehaviour } from "../../base/undefined-behaviour";
import { Row } from "./row";
import { TemplateLayout } from "./template-layout";

export class Template {
  constructor(
    public id: string,
    public layout: TemplateLayout,
    public rows: Row[],
    public breakpoint: number
  ) {}

  public moveColumn(columnId: string, position: string, targetColumnId: string) {
    if (columnId === targetColumnId) return;

    const columnRow = this.rows.find(row => row.columns.some(column => column.id === columnId));
    if (!columnRow) throw new Error(`Column with id ${columnId} not found.`);

    const targetRow = this.rows.find(row => row.columns.some(column => column.id === targetColumnId));
    if (!targetRow) throw new Error(`Row with target column id ${targetColumnId} not found.`);

    const column = columnRow.getColumnById(columnId);
    columnRow.deleteColumn(columnId);
    targetRow.addColumnNextTo(column, position, targetColumnId);

    this.removeEmptyRows();
  }

  public moveColumnToNewRow(columnId: string, rowPosition: string, targetRowId: string) {
    AssertionConcern.assertArgumentOneOf("position", rowPosition, ["before", "after"]);

    const columnRow = this.rows.find(row => row.columns.some(column => column.id === columnId));
    if (!columnRow) throw new Error(`Column with id ${columnId} not found.`);

    const indexTargetRow = this.rows.findIndex(row => row.id === targetRowId);
    if (indexTargetRow === -1) throw new Error(`Target row with id ${targetRowId} not found.`);

    const column = columnRow.getColumnById(columnId);
    columnRow.deleteColumn(columnId);

    if (column.layout.size.isPercentage()) {
      column.resize(100);
    } else {
      throw new UndefinedBehaviour();
    }

    const newRow = new Row(crypto.randomUUID(), [column]);

    if (rowPosition === "before") {
      this.rows.splice(indexTargetRow, 0, newRow);
    }

    if (rowPosition === "after") {
      this.rows.splice(indexTargetRow + 1, 0, newRow);
    }

    this.removeEmptyRows();
  }

  public resizeColumn(columnId: string, value: number) {
    const row = this.getRowByColumnId(columnId);
    row.resizeColumn(columnId, value);
  }

  public getRowById(rowId: string) {
    const row = this.rows.find(r => r.id === rowId);
    if (!row) throw new Error(`Row with id ${rowId} doest not exists.`);

    return row;
  }

  private getRowByColumnId(columnId: string) {
    for (const row of this.rows) {
      if (!row.existsColumn(columnId)) continue;

      return row;
    }

    throw new Error(`Column with id ${columnId} does not exists.`);
  }

  private removeEmptyRows() {
    this.rows = this.rows.filter(row => row.columns.length > 0);
  }
}
