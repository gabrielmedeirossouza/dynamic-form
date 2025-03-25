import { TemplateUiMapper } from "./template-ui-mapper";

export class FormUiMapper {
  static map(form, metadataList) {
    return {
      id: form.id,
      metadataList: metadataList,
      templates: form.templates.map(data => TemplateUiMapper.map(data, metadataList)),
      mainTemplate: TemplateUiMapper.map(form.mainTemplate, metadataList),
      minimumBreakpoint: {
        templateId: form.minimumBreakpoint.templateId,
        rowId: form.minimumBreakpoint.rowId,
        value: form.minimumBreakpoint.value
      },
      minimumFinalBreakpoint: {
        templateId: form.minimumFinalBreakpoint.templateId,
        rowId: form.minimumFinalBreakpoint.rowId,
        value: form.minimumFinalBreakpoint.value
      },
      isFormResponsive: form.isFormResponsive,
      existsDraftTemplate: form.existsDraftTemplate,
      isValidDraftTemplate: form.isValidDraftTemplate
    }
  }
}