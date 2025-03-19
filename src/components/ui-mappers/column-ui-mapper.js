import { ColumnLayoutUiMapper } from "./column-layout-ui-mapper";

export class ColumnUiMapper {
  static map(column, metadata, each = false) {
    if (each) return column.map(data => ColumnUiMapper.map(data))

    return {
      id: column.id,
      metadata,
      layout: ColumnLayoutUiMapper.map(column.layout)
    }
  }
}