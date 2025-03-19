import { TemplateUiMapper } from "./template-ui-mapper";

export class FormUiMapper {
  static map(form, metadataList) {
    return {
      metadataList: metadataList,
      templates: form.templates.map(data => TemplateUiMapper.map(data, metadataList)),
      mainTemplate: TemplateUiMapper.map(form.mainTemplate, metadataList),
      minimumBreakpoint: form.minimumBreakpoint,
      isFormResponsive: form.isFormResponsive
    }
  }
}