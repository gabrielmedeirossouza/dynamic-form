import { MetadataRepositoryRegistry } from "../metadata-repository-registry"

export class LoadFormAndMetadataListUseCase {
  constructor(formEditorGateway) {
    this.formEditorGateway = formEditorGateway
  }

  async execute() {
    const [form, metadataList] = await this.formEditorGateway.fetch()

    MetadataRepositoryRegistry.formRepository.load([form])
    MetadataRepositoryRegistry.metadataRepository.load(metadataList)

    return form.id
  }
}