import { MetadataRepositoryRegistry } from "../repositories/metadata-repository-registry"

export class SaveDraftTemplateUseCase {
  execute(formId, templateId) {
    const form = MetadataRepositoryRegistry.formRepository.getById(formId)
    const template = form.getTemplateById(templateId)

    template.draft = false

    const isTemplateValid = form.isTemplateValid(template.id)
    if (!isTemplateValid) throw new Error(`Invalid draft template with id ${templateId}.`)

    MetadataRepositoryRegistry.formRepository.update(form)
    return true
  }
}