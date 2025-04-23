import { Form } from "../../domain/form/form";
import { Metadata } from "../../domain/metadata/metadata";
import { TemplateMapper } from "./template-mapper";

export type FormDto = ReturnType<typeof FormMapper.map>

export class FormMapper {
  public static map(form: Form, metadataList: Metadata[]) {
    return {
      id: form.id,
      metadataList: metadataList,
      templates: form.templates.map(template => TemplateMapper.map(template, metadataList)),
      mainTemplate: TemplateMapper.map(form.mainTemplate, metadataList)
    };
  }
}
