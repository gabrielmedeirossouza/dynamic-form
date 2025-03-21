import { RowUiMapper } from "./row-ui-mapper";
import { TemplateLayoutUiMapper } from "./template-layout-ui-mapper";

export class TemplateUiMapper {
  static map(template, metadataList, each = false) {
    if (each) return template.map(data => TemplateUiMapper.map(data, metadataList))

    return {
      id: template.id,
      layout: TemplateLayoutUiMapper.map(template.layout),
      breakpoint: template.breakpoint,
      rows: template.rows.map(data => RowUiMapper.map(data, metadataList)),
      draft: template.draft
    }
  }
}