export class Row {
  constructor(columns, layout) {
    this.id = crypto.randomUUID();
    this.columns = columns;
    this.layout = layout;

    for (const column of columns) {
      column.setParent(this);
    }
  }

  setParent(parent) {
    this.parent = parent;
  }

  attemptGetColumn(columnId) {
    return this.columns.find(c => c.metadata.id === columnId);
  }

  deleteColumn(columnId) {
    this._assertParent();
    this._assertParentHasMethod('deleteRow');

    const deletedColumn = this.columns.splice(this.columns.findIndex(c => c.metadata.id === columnId), 1)[0];

    if (this.columns.length === 0) {
      this.parent.deleteRow(this);
    }

    return deletedColumn;
  }

  insertColumn(column, position, targetId) {
    column.setParent(this);
    const targetIndex = this.columns.findIndex(c => c.metadata.id === targetId);

    if (position === 'before') {
      this.columns.splice(targetIndex, 0, column);
    } else {
      this.columns.splice(targetIndex + 1, 0, column);
    }
  }

  _assertParent() {
    if (!this.parent) {
      throw new Error("Row must have a parent!");
    }
  }

  _assertParentHasMethod(method) {
    if (typeof this.parent[method] !== 'function') {
      throw new Error(`Row parent must have a ${method} method!`);
    }
  }
}