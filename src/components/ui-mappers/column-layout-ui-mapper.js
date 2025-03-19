import { SizeUiMapper } from "./size-ui-mapper";

export class ColumnLayoutUiMapper {
  static map(columnLayout, each = false) {
    if (each) return columnLayout.map(data => ColumnLayoutUiMapper.map(data))

    return {
      size: SizeUiMapper.map(columnLayout.size)
    }
  }
}