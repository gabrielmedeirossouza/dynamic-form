import { ColumnLayout } from "../../domain/form/column-layout";
import { SizeMapper } from "./size-mapper";

export class ColumnLayoutMapper {
  public static map(columnLayout: ColumnLayout) {
    return {
      size: SizeMapper.map(columnLayout.size)
    };
  }
}
