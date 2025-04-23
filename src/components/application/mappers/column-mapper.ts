import { Column } from "../../domain/form/column";
import { Metadata } from "../../domain/metadata/metadata";
import { ColumnLayoutMapper } from "./column-layout-mapper";

export class ColumnMapper {
  public static map(column: Column, metadata: Metadata) {
    return {
      id: column.id,
      metadata,
      layout: ColumnLayoutMapper.map(column.layout)
    };
  }
}
