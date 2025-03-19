export class TemplateLayoutUiMapper {
  static map(templateLayout, each = false) {
    if (each) return templateLayout.map(data => TemplateLayoutUiMapper.map(data))

    return {
      rowGap: templateLayout.rowGap,
      columnGap: templateLayout.columnGap
    }
  }
}