import { MetadataRepositoryRegistry } from "../repositories/metadata-repository-registry";

export class ResizeColumnUseCase {
  execute(formId, templateId, columnId, value, min) {
    const form = MetadataRepositoryRegistry.formRepository.getById(formId)
    form.resizeColumn(templateId, columnId, value, min)
    MetadataRepositoryRegistry.formRepository.update(form)
  }
}