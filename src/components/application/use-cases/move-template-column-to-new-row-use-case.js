import { MetadataRepositoryRegistry } from "../metadata-repository-registry"

export class MoveTemplateColumnToNewRowUseCase {
  execute(formId, templateId, metadataId, rowPosition, targetRowId) {
    const form = MetadataRepositoryRegistry.formRepository.getById(formId)
    form.moveTemplateColumnToNewRow(templateId, metadataId, rowPosition, targetRowId)
    MetadataRepositoryRegistry.formRepository.update(form)
  }
}