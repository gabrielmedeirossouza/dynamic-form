import { ColumnLayout } from "../../domain/form/column-layout";
import { SizeMapper } from "./size-mapper";

export class ColumnLayoutMapper {
  static map(columnLayout, each = false) {
    if (each) return columnLayout.map(data => ColumnLayoutMapper.map(data))

    return {
      size: SizeMapper.map(columnLayout.size)
    }
  }

  static from(columnLayout, each = false) {
    if (each) return columnLayout.map(data => ColumnLayoutMapper.from(data))

    return new ColumnLayout(SizeMapper.from(columnLayout.size))
  }
}