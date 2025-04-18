import { AssertionConcern } from "../../base/assertion-concern";
import { Column } from "./column";

export class Row {
  constructor(
    public id: string,
    public columns: Column[]
  ) {}

  get #percentageUsage() {
    const percentageUsage = this.columns.reduce((acc, column) => {
      return acc + column.layout.size.value;
    }, 0);

    return percentageUsage;
  }

  get #percentageRemaining() {
    return 100 - this.#percentageUsage;
  }

  get #percentageProportion() {
    return 100 / this.columns.length;
  }

  get #hasAvailablePercentageSpace() {
    return this.#percentageRemaining >= 20;
  }

  public addColumnNextTo(column, position, targetColumnId) {
    AssertionConcern.assertArgumentOneOf("position", position, ["before", "after"]);

    if (column.layout.size.isPercentage && this.#hasAvailablePercentageSpace) {
      column.resize(this.#percentageRemaining, column.layout.size.min);
    }

    const hasAvailablePercentageSpace = this.#hasAvailablePercentageSpace;
    const targetIndex = this.#getColumnIndexById(targetColumnId);

    if (position === "before") {
      this.columns.splice(targetIndex, 0, column);
    } else {
      this.columns.splice(targetIndex + 1, 0, column);
    }

    if (column.layout.size.isPercentage && !hasAvailablePercentageSpace) {
      this.#resizeProportionalPercentageColumns();
    }
  }

  public deleteColumn(columnId) {
    const columnIndex = this.#getColumnIndexById(columnId);
    this.columns.splice(columnIndex, 1);
  }

  public changeColumnType(columnId, type) {
    const column = this.getColumnById(columnId);
    if (column.layout.size.type === type) return;

    if (type === "fixed") {
      column.changeSize("fixed", column.layout.size.min);

      return;
    }

    if (this.#hasAvailablePercentageSpace) {
      column.changeSize("percentage", this.#percentageRemaining, 320);

      return;
    }

    column.changeSize("percentage", this.#percentageProportion, 320);
    this.#resizeProportionalPercentageColumns();
  }

  public resizeColumn(columnId, value, min) {
    const column = this.getColumnById(columnId);

    if (column.layout.size.isFixed) {
      column.resize(value);

      return;
    }

    column.resize(value, min);
  }

  public existsColumn(columnId) {
    return this.columns.some(c => c.id === columnId);
  }

  public calculateBreakpoint(column) {
    return this.breakpoint + column.layout.size.staticValue;
  }

  public getColumnById(columnId) {
    const column = this.columns.find(c => c.id === columnId);
    if (!column) throw new Error(`Column with id ${columnId} does not exists.`);

    return column;
  }

  public checkIsValidResizePercentageColumn(columnId, value) {
    const totalUsage = this.columns.reduce((acc, column) => {
      if (!column.layout.size.isPercentage) return acc;

      if (column.id === columnId) {
        return acc + value;
      }

      return acc + column.layout.size.value;
    }, 0);

    return totalUsage <= 100;
  }

  #resizeProportionalPercentageColumns() {
    for (const column of this.columns) {
      if (column.layout.size.isFixed) continue;
      column.resize(this.#percentageProportion, column.layout.size.min);
    }
  }

  #getColumnIndexById(columnId) {
    const index = this.columns.findIndex(column => column.id === columnId);
    if (index === -1) throw new Error(`Column with id ${columnId} not found in row ${this.id}.`);

    return index;
  }
}
