export class Column {
  constructor(metadata, layout) {
    this.metadata = metadata;
    this.layout = layout;
  }

  setParent(parent) {
    this.parent = parent;
  }

  delete() {
    this._assertParent();
    this._assertParentHasMethod('deleteColumn');
    return this.parent.deleteColumn(this.metadata.id);
  }

  insertAdjacentColumn(column, position) {
    this._assertParent();
    this._assertParentHasMethod('insertColumn');
    this.parent.insertColumn(column, position, this.metadata.id);
  }

  _assertParent() {
    if (!this.parent) {
      throw new Error("Column must have a parent!");
    }
  }

  _assertParentHasMethod(method) {
    if (typeof this.parent[method] !== 'function') {
      throw new Error(`Column parent must have a ${method} method!`);
    }
  }
}