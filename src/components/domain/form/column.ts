import { ColumnLayout } from "./column-layout";

export class Column {
  constructor(
    public id: string,
    public metadataId: string,
    public layout: ColumnLayout
  ) {}

  public resize(value: number) {
    const size = this.layout.size.resize(value);
    this.layout = new ColumnLayout(size);
  }
}
