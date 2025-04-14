import { ColumnLayout } from "./column-layout";
import { Size } from "./size";

export class Column {
  private _layout: ColumnLayout;

  constructor(
    public id: string,
    public metadataId: string,
    layout: ColumnLayout
  ) {
    this._layout = layout;
  }

  public get layout() {
    return this._layout;
  }

  public resize(type: string, value: number) {
    const size = new Size(type, value);
    this._layout = new ColumnLayout(size);
  }
}
