import { MetadataMapper } from "../mappers/metadata-mapper"
import { MetadataRepositoryRegistry } from "../metadata-repository-registry"

export class GetFormMetadataListUseCase {
  execute(formId) {
    const form = MetadataRepositoryRegistry.formRepository.getById(formId)
    const metadataList = MetadataRepositoryRegistry.metadataRepository.getMetadataListByIds(form.metadataIds)

    return MetadataMapper.map(metadataList, true)
  }
}