import { Form } from "../domain/form/form";
import { TemplateMapper } from "./template-mapper";

export class FormMapper {
  static map(form, each = false) {
    if (each) return form.map(data => FormMapper.map(data))

    return {
      id: form.id,
      metadataIds: form.metadataIds,
      templates: TemplateMapper.map(form.templates, true),
      mainTemplate: TemplateMapper.map(form.mainTemplate),
      minimumBreakpoint: form.minimumBreakpoint,
      isFormResponsive: form.isFormResponsive
    }
  }

  static from(form, each = false) {
    if (each) return form.map(data => FormMapper.from(data))

    return new Form(
      form.id,
      [...form.metadataIds],
      TemplateMapper.from(form.templates, true)
    )
  }
}