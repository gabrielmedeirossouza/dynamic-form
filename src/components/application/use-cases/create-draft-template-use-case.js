import { Template } from "../../domain/form/template";
import { MetadataRepositoryRegistry } from "../metadata-repository-registry";

export class CreateDraftTemplateUseCase {
  execute(formId, templateId) {
    const form = MetadataRepositoryRegistry.formRepository.getById(formId)
    const template = form.getTemplateById(templateId)

    const newTemplate = new Template(
      crypto.randomUUID(),
      template.layout,
      template.rows,
      false,
      true
    )

    form.addDraftTemplate(newTemplate)
    MetadataRepositoryRegistry.formRepository.update(form)

    return newTemplate.id
  }
}