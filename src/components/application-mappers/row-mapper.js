import { Row } from "../domain/form/row";
import { ColumnMapper } from "./column-mapper";

export class RowMapper {
  static map(row, each = false) {
    if (each) return row.map(data => RowMapper.map(data))

    return {
      id: row.id,
      columns: ColumnMapper.map(row.columns, true),
      breakpoint: row.breakpoint
    }
  }

  static from(row, each = false) {
    if (each) return row.map(data => RowMapper.from(data))

    return new Row(
      row.id,
      ColumnMapper.from(row.columns, true),
    )
  }
}