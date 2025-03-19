import { TemplateLayout } from "../../domain/form/template-layout"

export class TemplateLayoutMapper {
  static map(templateLayout, each = false) {
    if (each) return templateLayout.map(data => TemplateLayoutMapper.map(data))

    return {
      rowGap: templateLayout.rowGap,
      columnGap: templateLayout.columnGap
    }
  }

  static from(templateLayout, each = false) {
    if (each) return templateLayout.map(data => TemplateLayoutMapper.from(data))

    return new TemplateLayout(templateLayout.rowGap, templateLayout.columnGap)
  }
}