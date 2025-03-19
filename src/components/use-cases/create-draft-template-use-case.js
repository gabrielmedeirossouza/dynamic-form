import { Template } from "../domain/form/template"
import { TemplateMapper } from "../application-mappers/template-mapper"
import { MetadataRepositoryRegistry } from "../repositories/metadata-repository-registry"

export class CreateDraftTemplateUseCase {
  execute(formId, templateId) {
    const form = MetadataRepositoryRegistry.formRepository.getById(formId)
    const template = form.getTemplateById(templateId)

    const newTemplate = new Template(crypto.randomUUID(), template.layout, template.rows, true)
    form.addDraftTemplate(newTemplate)

    MetadataRepositoryRegistry.formRepository.update(form)

    return TemplateMapper.map(newTemplate)
  }
}