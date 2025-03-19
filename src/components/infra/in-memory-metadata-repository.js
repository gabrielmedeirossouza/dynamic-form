import { MetadataMapper } from "../application/mappers/metadata-mapper"

export class InMemoryMetadataRepository {
  static #mappedMetadataList = []

  getById(metadataId) {
    const mappedMetadata = InMemoryMetadataRepository.#mappedMetadataList.find(m => m.id === metadataId)
    if (!mappedMetadata) throw new Error(`Metadata with id ${metadataId} does not exists.`)

    return MetadataMapper.from(mappedMetadata)
  }

  getMetadataListByIds(ids) {
    const metadataList = []

    for (const id of ids) {
      const mappedMetadata = this.getById(id)
      metadataList.push(mappedMetadata)
    }

    return metadataList
  }

  add(metadata) {
    const alreadyExists = InMemoryMetadataRepository.#mappedMetadataList.findIndex(m => m.id === metadata.id)
    if (alreadyExists !== -1) throw new Error(`Metadata with id ${metadata.id} already exists.`)

    InMemoryMetadataRepository.#mappedMetadataList.push(MetadataMapper.map(metadata))
  }

  load(metadataList) {
    for (const metadata of metadataList) {
      const metadataIndex = InMemoryMetadataRepository.#mappedMetadataList.findIndex(m => m.id === metadata.id)
      if (metadataIndex !== -1) {
        InMemoryMetadataRepository.#mappedMetadataList.splice(metadataIndex, 1, MetadataMapper.map(metadata))
        continue
      }

      this.add(metadata)
    }
  }
}