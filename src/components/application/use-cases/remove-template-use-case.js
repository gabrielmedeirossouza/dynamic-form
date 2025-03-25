import { MetadataRepositoryRegistry } from "../metadata-repository-registry";

export class RemoveTemplateUseCase {
  execute(formId, templateId) {
    const form = MetadataRepositoryRegistry.formRepository.getById(formId)
    form.removeTemplate(templateId)
    MetadataRepositoryRegistry.formRepository.update(form)
  }
}