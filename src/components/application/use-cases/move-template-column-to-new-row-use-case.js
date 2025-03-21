import { MetadataRepositoryRegistry } from "../metadata-repository-registry"

export class MoveTemplateColumnToNewRowUseCase {
  execute(formId, templateId, columnId, rowPosition, targetRowId) {
    const form = MetadataRepositoryRegistry.formRepository.getById(formId)
    form.moveTemplateColumnToNewRow(templateId, columnId, rowPosition, targetRowId)
    MetadataRepositoryRegistry.formRepository.update(form)
  }
}