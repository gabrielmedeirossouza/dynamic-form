import { AssertionConcern } from "../../base/assertion-concern";
import { Column } from "./column";

export class Row {
  constructor(
    public id: string,
    public columns: Column[]
  ) {}

  private get percentageUsage() {
    const percentageUsage = this.columns.reduce((acc, column) => {
      if (!column.layout.size.isPercentage()) return acc;

      return acc + column.layout.size.value;
    }, 0);

    return percentageUsage;
  }

  private get percentageRemaining() {
    return 100 - this.percentageUsage;
  }

  private get percentageProportion() {
    return 100 / this.columns.length;
  }

  private get hasAvailablePercentageSpace() {
    return this.percentageRemaining >= 20;
  }

  public addColumnNextTo(column: Column, position: string, targetColumnId: string) {
    AssertionConcern.assertArgumentOneOf("position", position, ["before", "after"]);

    if (column.layout.size.isPercentage() && this.hasAvailablePercentageSpace) {
      column.resize(this.percentageRemaining);
    }

    const hasAvailablePercentageSpace = this.hasAvailablePercentageSpace;
    const targetIndex = this.getColumnIndexById(targetColumnId);

    if (position === "before") {
      this.columns.splice(targetIndex, 0, column);
    } else {
      this.columns.splice(targetIndex + 1, 0, column);
    }

    if (column.layout.size.isPercentage() && !hasAvailablePercentageSpace) {
      this.resizeProportionalPercentageColumns();
    }
  }

  public deleteColumn(columnId: string) {
    const columnIndex = this.getColumnIndexById(columnId);
    this.columns.splice(columnIndex, 1);
  }

  public resizeColumn(columnId: string, value: number) {
    const column = this.getColumnById(columnId);
    column.resize(value);
  }

  public existsColumn(columnId: string) {
    return this.columns.some(c => c.id === columnId);
  }

  public getColumnById(columnId: string) {
    const column = this.columns.find(c => c.id === columnId);
    if (!column) throw new Error(`Column with id ${columnId} does not exists.`);

    return column;
  }

  public checkIsValidResizePercentageColumn(columnId: string, value: number) {
    const totalUsage = this.columns.reduce((acc, column) => {
      if (!column.layout.size.isPercentage()) return acc;

      if (column.id === columnId) {
        return acc + value;
      }

      return acc + column.layout.size.value;
    }, 0);

    return totalUsage <= 100;
  }

  private resizeProportionalPercentageColumns() {
    for (const column of this.columns) {
      if (!column.layout.size.isPercentage()) continue;
      column.resize(this.percentageProportion);
    }
  }

  private getColumnIndexById(columnId: string) {
    const index = this.columns.findIndex(column => column.id === columnId);
    if (index === -1) throw new Error(`Column with id ${columnId} not found in row ${this.id}.`);

    return index;
  }
}
