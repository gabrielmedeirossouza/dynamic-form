import { MetadataRepositoryRegistry } from "../metadata-repository-registry"

export class CheckTemplateIsValidUseCase {
  execute(formId, templateId) {
    const form = MetadataRepositoryRegistry.formRepository.getById(formId)
    return form.isTemplateValid(templateId)
  }
}