import { ColumnUiMapper } from "./column-ui-mapper";

export class RowUiMapper {
  static map(row, metadataList, each = false) {
    if (each) return row.map(data => RowUiMapper.map(data, metadataList))

    return {
      id: row.id,
      columns: row.columns.map(data => {
        const metadata = metadataList.find(m => m.id === data.metadataId)
        if (!metadata) throw new Error(`Metadata with id ${data.metadataId} not found.`)

        return ColumnUiMapper.map(data, metadata)
      }),
      breakpoint: row.breakpoint,
    }
  }
}