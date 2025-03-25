import { RowUiMapper } from "./row-ui-mapper";
import { TemplateLayoutUiMapper } from "./template-layout-ui-mapper";

export class TemplateUiMapper {
  static map(template, metadataList, each = false) {
    if (each) return template.map(data => TemplateUiMapper.map(data, metadataList))

    return {
      id: template.id,
      layout: TemplateLayoutUiMapper.map(template.layout),
      breakpoint: {
        rowId: template.breakpoint.rowId,
        value: template.breakpoint.value
      },
      rows: template.rows.map(data => RowUiMapper.map(data, metadataList)),
      main: template.main,
      draft: template.draft
    }
  }
}