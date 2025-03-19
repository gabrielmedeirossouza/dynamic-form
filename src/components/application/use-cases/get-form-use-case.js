import { FormMapper } from "../mappers/form-mapper"
import { MetadataRepositoryRegistry } from "../metadata-repository-registry"

export class GetFormUseCase {
  execute(formId) {
    const form = MetadataRepositoryRegistry.formRepository.getById(formId)
    return FormMapper.map(form)
  }
}