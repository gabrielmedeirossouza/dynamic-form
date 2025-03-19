import { FormMapper } from "../application-mappers/form-mapper"
import { MetadataRepositoryRegistry } from "../repositories/metadata-repository-registry"

export class GetFormUseCase {
  execute(formId) {
    const form = MetadataRepositoryRegistry.formRepository.getById(formId)
    return FormMapper.map(form)
  }
}