import { MetadataRepositoryRegistry } from "../metadata-repository-registry"

export class MoveTemplateColumnUseCase {
  execute(formId, templateId, metadataId, position, targetId) {
    const form = MetadataRepositoryRegistry.formRepository.getById(formId)
    form.moveTemplateColumn(templateId, metadataId, position, targetId)
    MetadataRepositoryRegistry.formRepository.update(form)
  }
}