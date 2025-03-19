import { Column } from "../domain/form/column";
import { ColumnLayoutMapper } from "./column-layout-mapper";

export class ColumnMapper {
  static map(column, each = false) {
    if (each) return column.map(data => ColumnMapper.map(data))

    return {
      id: column.id,
      metadataId: column.metadataId,
      layout: ColumnLayoutMapper.map(column.layout)
    }
  }

  static from(column, each = false) {
    if (each) return column.map(data => ColumnMapper.from(data))

    return new Column(column.id, column.metadataId, ColumnLayoutMapper.from(column.layout))
  }
}