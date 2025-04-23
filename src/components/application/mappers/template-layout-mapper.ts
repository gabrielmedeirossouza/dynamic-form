import { TemplateLayout } from "../../domain/form/template-layout";

export class TemplateLayoutMapper {
  public static map(templateLayout: TemplateLayout) {
    return {
      rowGap: templateLayout.rowGap,
      columnGap: templateLayout.columnGap
    };
  }
}
