import { Row } from "../../domain/form/row";
import { Metadata } from "../../domain/metadata/metadata";
import { ColumnMapper } from "./column-mapper";

export class RowMapper {
  public static map(row: Row, metadataList: Metadata[]) {
    return {
      id: row.id,
      columns: row.columns.map(column => {
        const metadata = metadataList.find(_metadata => _metadata.id === column.metadataId);

        if (!metadata) {
          const providedMetadataIds = metadataList.map(_metadata => _metadata.id).join(", ");

          throw new Error(
            `Metadata with id ${column.metadataId} not found. Provided metadata list ids: ${providedMetadataIds}.`
          );
        }

        return ColumnMapper.map(column, metadata);
      })
    };
  }
}
