import { Template } from "../domain/form/template";
import { RowMapper } from "./row-mapper";
import { TemplateLayoutMapper } from "./template-layout-mapper";

export class TemplateMapper {
  static map(template, each = false) {
    if (each) return template.map(data => TemplateMapper.map(data))

    return {
      id: template.id,
      layout: TemplateLayoutMapper.map(template.layout),
      breakpoint: template.breakpoint,
      rows: RowMapper.map(template.rows, true),
      draft: template.draft
    }
  }

  static from(template, each = false) {
    if (each) return template.map(data => TemplateMapper.from(data))

    return new Template(
      template.id,
      TemplateLayoutMapper.from(template.layout),
      RowMapper.from(template.rows, true),
      template.draft
    )
  }
}