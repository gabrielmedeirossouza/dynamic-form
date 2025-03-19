import { MetadataRepositoryRegistry } from "../repositories/metadata-repository-registry"

export class ChangeColumnTypeUseCase {
  execute(formId, templateId, columnId, type) {
    const form = MetadataRepositoryRegistry.formRepository.getById(formId)
    form.changeColumnType(templateId, columnId, type)
    MetadataRepositoryRegistry.formRepository.update(form)
  }
}