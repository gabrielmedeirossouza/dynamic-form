import { MetadataRepositoryRegistry } from "../metadata-repository-registry"

export class MoveTemplateColumnUseCase {
  execute(formId, templateId, columnId, position, targetId) {
    const form = MetadataRepositoryRegistry.formRepository.getById(formId)
    form.moveTemplateColumn(templateId, columnId, position, targetId)
    MetadataRepositoryRegistry.formRepository.update(form)
  }
}